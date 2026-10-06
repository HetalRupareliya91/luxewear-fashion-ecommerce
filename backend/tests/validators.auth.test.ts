import test from "node:test";
import assert from "node:assert/strict";
import { validateLogin, validateRegister } from "../src/validators/auth.js";

test("validateRegister normalises a good payload", () => {
  const r = validateRegister({ email: " Asha@Example.COM ", password: "hunter22x", firstName: " Asha ", lastName: "" });
  assert.deepEqual(r, { ok: true, value: { email: "asha@example.com", password: "hunter22x", firstName: "Asha" } });
});

test("validateRegister reports every problem at once", () => {
  const r = validateRegister({ email: "nope", password: "short", firstName: "" });
  assert.equal(r.ok, false);
  if (!r.ok) assert.deepEqual(Object.keys(r.errors).sort(), ["email", "firstName", "password"]);
});

test("validateRegister handles non-object bodies", () => {
  assert.equal(validateRegister(undefined).ok, false);
  assert.equal(validateRegister("x").ok, false);
});

test("validateLogin", () => {
  assert.deepEqual(validateLogin({ email: "A@B.IO", password: "x" }), { ok: true, value: { email: "a@b.io", password: "x" } });
  const bad = validateLogin({ email: "a@b.io", password: "" });
  assert.equal(bad.ok, false);
});
