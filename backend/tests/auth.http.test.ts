import test from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter } from "../src/middleware/rateLimit.js";
import { startAuthApp } from "./helpers/httpApp.js";

const good = { email: "Asha@Example.com", password: "Correct-Horse-9", firstName: "Asha" };

test("register creates a customer, sets an HttpOnly cookie and never returns the token or hash", async () => {
  const app = await startAuthApp();
  try {
    const r = await app.client().request("/register", { body: good });
    assert.equal(r.status, 201);
    assert.equal(r.json.success, true);
    assert.deepEqual(r.json.data.user, { id: "u1", email: "asha@example.com", firstName: "Asha", lastName: null, role: "CUSTOMER" });
    assert.equal(JSON.stringify(r.json).includes("passwordHash"), false);
    assert.equal(JSON.stringify(r.json).includes("token"), false);
    for (const flag of ["HttpOnly", "Path=/", "SameSite=Lax", "Max-Age=3600"]) assert.ok(r.setCookie?.includes(flag), flag);
  } finally {
    await app.close();
  }
});

test("register validation errors list every bad field", async () => {
  const app = await startAuthApp();
  try {
    const r = await app.client().request("/register", { body: { email: "nope", password: "short", firstName: "" } });
    assert.equal(r.status, 400);
    assert.deepEqual(Object.keys(r.json.details).sort(), ["email", "firstName", "password"]);
  } finally {
    await app.close();
  }
});

test("duplicate email is a 409 and a client cannot choose its own role", async () => {
  const app = await startAuthApp();
  try {
    const c = app.client();
    assert.equal((await c.request("/register", { body: { ...good, role: "ADMIN" } })).status, 201);
    assert.equal(app.users.all()[0].role, "CUSTOMER");
    assert.equal((await app.client().request("/register", { body: good })).status, 409);
  } finally {
    await app.close();
  }
});

test("malformed JSON is a 400 (not a 500)", async () => {
  const app = await startAuthApp();
  try {
    const r = await app.client().request("/login", { rawBody: "{not json" });
    assert.equal(r.status, 400);
    assert.equal(r.json.message, "Invalid request body");
  } finally {
    await app.close();
  }
});

test("login works with the right password and gives the same 401 for unknown email and wrong password", async () => {
  const app = await startAuthApp();
  try {
    await app.client().request("/register", { body: good });
    const ok = await app.client().request("/login", { body: { email: "asha@example.com", password: good.password } });
    assert.equal(ok.status, 200);
    assert.ok(ok.setCookie?.startsWith("lw_token="));
    const wrong = await app.client().request("/login", { body: { email: "asha@example.com", password: "wrong-password1" } });
    const ghost = await app.client().request("/login", { body: { email: "ghost@example.com", password: "wrong-password1" } });
    assert.equal(wrong.status, 401);
    assert.equal(ghost.status, 401);
    assert.equal(wrong.json.message, ghost.json.message);
    assert.equal(wrong.setCookie, undefined);
  } finally {
    await app.close();
  }
});

test("the limiter answers 429 after too many attempts", async () => {
  const app = await startAuthApp({ limiter: createRateLimiter({ max: 3, windowMs: 60_000 }) });
  try {
    const c = app.client();
    const statuses: number[] = [];
    for (let i = 0; i < 5; i++) statuses.push((await c.request("/login", { body: { email: "a@b.co", password: "x" } })).status);
    assert.deepEqual(statuses, [401, 401, 401, 429, 429]);
  } finally {
    await app.close();
  }
});
