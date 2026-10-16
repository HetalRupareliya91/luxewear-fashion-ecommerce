import assert from "node:assert/strict";
import { test } from "node:test";
import { startAuthApp } from "./helpers/httpApp.js";

const signup = { email: "asha@example.com", password: "Passw0rd1", firstName: "Asha", lastName: "Patel" };

async function signedIn() {
  const app = await startAuthApp();
  const client = app.client();
  await client.request("/register", { body: signup });
  return { app, client };
}

test("profile changes need a login", async () => {
  const app = await startAuthApp();
  try {
    assert.equal((await app.client().request("/me", { method: "PATCH", body: { firstName: "X" } })).status, 401);
    assert.equal((await app.client().request("/change-password", { body: { currentPassword: "a", newPassword: "Passw0rd2" } })).status, 401);
  } finally {
    await app.close();
  }
});

test("a customer can change their name", async () => {
  const { app, client } = await signedIn();
  try {
    const res = await client.request("/me", { method: "PATCH", body: { firstName: " Ashvi ", lastName: "" } });
    assert.equal(res.status, 200);
    assert.equal(res.json.data.user.firstName, "Ashvi");
    assert.equal(res.json.data.user.lastName, null);
    assert.equal((await client.request("/me")).json.data.user.firstName, "Ashvi");
  } finally {
    await app.close();
  }
});

test("a profile update cannot change email or role", async () => {
  const { app, client } = await signedIn();
  try {
    const res = await client.request("/me", { method: "PATCH", body: { firstName: "Asha", email: "evil@example.com", role: "ADMIN" } });
    assert.equal(res.status, 200);
    assert.equal(res.json.data.user.email, "asha@example.com");
    assert.equal(res.json.data.user.role, "CUSTOMER");
  } finally {
    await app.close();
  }
});

test("empty or invalid profile updates are rejected", async () => {
  const { app, client } = await signedIn();
  try {
    assert.equal((await client.request("/me", { method: "PATCH", body: {} })).status, 400);
    assert.equal((await client.request("/me", { method: "PATCH", body: { firstName: "" } })).status, 400);
    assert.equal((await client.request("/me", { method: "PATCH", body: { lastName: "x".repeat(61) } })).status, 400);
  } finally {
    await app.close();
  }
});

test("changing the password needs the current one", async () => {
  const { app, client } = await signedIn();
  try {
    const wrong = await client.request("/change-password", { body: { currentPassword: "Wrong0ne1", newPassword: "N3wPassword" } });
    assert.equal(wrong.status, 400);
    assert.ok(wrong.json.details.currentPassword);

    const weak = await client.request("/change-password", { body: { currentPassword: "Passw0rd1", newPassword: "short" } });
    assert.equal(weak.status, 400);
    assert.ok(weak.json.details.newPassword);

    const same = await client.request("/change-password", { body: { currentPassword: "Passw0rd1", newPassword: "Passw0rd1" } });
    assert.equal(same.status, 400);

    const ok = await client.request("/change-password", { body: { currentPassword: "Passw0rd1", newPassword: "N3wPassword" } });
    assert.equal(ok.status, 200);
    assert.equal((await app.client().request("/login", { body: { email: signup.email, password: "Passw0rd1" } })).status, 401);
    assert.equal((await app.client().request("/login", { body: { email: signup.email, password: "N3wPassword" } })).status, 200);
  } finally {
    await app.close();
  }
});
