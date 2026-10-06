import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/modules/auth/password.js";

test("a password verifies against its own hash", async () => {
  const hash = await hashPassword("Correct-Horse-9");
  assert.match(hash, /^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
  assert.equal(await verifyPassword("Correct-Horse-9", hash), true);
});

test("a wrong password fails", async () => {
  const hash = await hashPassword("Correct-Horse-9");
  assert.equal(await verifyPassword("correct-horse-9", hash), false);
});

test("the same password hashes differently each time (random salt)", async () => {
  assert.notEqual(await hashPassword("same"), await hashPassword("same"));
});

test("malformed stored hashes never verify", async () => {
  for (const bad of ["", "plain", "bcrypt$a$b", "scrypt$only-two"]) assert.equal(await verifyPassword("x", bad), false);
});
