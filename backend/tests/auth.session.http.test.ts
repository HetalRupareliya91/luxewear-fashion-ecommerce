import test from "node:test";
import assert from "node:assert/strict";
import { signToken } from "../src/modules/auth/token.js";
import { SECRET, startAuthApp } from "./helpers/httpApp.js";

const good = { email: "asha@example.com", password: "Correct-Horse-9", firstName: "Asha", lastName: "Mehta" };

test("/me returns the signed-in user using only the cookie", async () => {
  const app = await startAuthApp();
  try {
    const c = app.client();
    await c.request("/register", { body: good });
    const me = await c.request("/me");
    assert.equal(me.status, 200);
    assert.equal(me.json.data.user.email, "asha@example.com");
    assert.equal(me.json.data.user.lastName, "Mehta");
    assert.equal(JSON.stringify(me.json).includes("passwordHash"), false);
  } finally {
    await app.close();
  }
});

test("/me without a cookie, with a forged cookie, or for a deleted account is a 401", async () => {
  const app = await startAuthApp();
  try {
    assert.equal((await app.client().request("/me")).status, 401);
    assert.equal((await app.client().request("/me", { headers: { Cookie: "lw_token=forged.value" } })).status, 401);
    const ghostToken = signToken({ sub: "does-not-exist", role: "CUSTOMER" }, SECRET);
    assert.equal((await app.client().request("/me", { headers: { Authorization: `Bearer ${ghostToken}` } })).status, 401);
  } finally {
    await app.close();
  }
});

test("a Bearer token also works for API clients", async () => {
  const app = await startAuthApp();
  try {
    const c = app.client();
    const reg = await c.request("/register", { body: good });
    const token = signToken({ sub: reg.json.data.user.id, role: "CUSTOMER" }, SECRET);
    const me = await app.client().request("/me", { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(me.status, 200);
  } finally {
    await app.close();
  }
});

test("logout clears the cookie and /me then fails", async () => {
  const app = await startAuthApp();
  try {
    const c = app.client();
    await c.request("/register", { body: good });
    const out = await c.request("/logout", { method: "POST" });
    assert.equal(out.status, 200);
    assert.deepEqual(out.json.data, { loggedOut: true });
    assert.ok(out.setCookie?.includes("Max-Age=0"));
    assert.equal(c.cookie, "");
    assert.equal((await c.request("/me")).status, 401);
  } finally {
    await app.close();
  }
});
