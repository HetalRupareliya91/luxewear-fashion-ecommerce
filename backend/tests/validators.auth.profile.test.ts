import assert from "node:assert/strict";
import { test } from "node:test";
import { validateChangePassword, validateProfileUpdate } from "../src/validators/auth.js";

test("a profile update accepts only names", () => {
  const r = validateProfileUpdate({ firstName: " Asha ", lastName: " Patel ", email: "x@y.co", role: "ADMIN" });
  assert.ok(r.ok);
  if (r.ok) assert.deepEqual(r.value, { firstName: "Asha", lastName: "Patel" });
});

test("an empty last name clears it", () => {
  for (const lastName of ["", null]) {
    const r = validateProfileUpdate({ lastName });
    assert.ok(r.ok);
    if (r.ok) assert.deepEqual(r.value, { lastName: null });
  }
});

test("a profile update needs at least one field", () => {
  assert.equal(validateProfileUpdate({}).ok, false);
  assert.equal(validateProfileUpdate(undefined).ok, false);
  assert.equal(validateProfileUpdate({ firstName: "   " }).ok, false);
});

test("change password checks both fields", () => {
  assert.ok(validateChangePassword({ currentPassword: "anything", newPassword: "N3wPassword" }).ok);
  const bad = validateChangePassword({ currentPassword: "", newPassword: "weak" });
  assert.equal(bad.ok, false);
  if (!bad.ok) {
    assert.ok(bad.errors.currentPassword);
    assert.ok(bad.errors.newPassword);
  }
});
