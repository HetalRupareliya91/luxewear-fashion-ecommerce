import test from "node:test";
import assert from "node:assert/strict";
import { isEmail, isNonEmpty, isPhone, isPostalCode, isStrongPassword } from "../src/validators/primitives.js";

test("isEmail", () => {
  assert.equal(isEmail("a@b.co"), true);
  assert.equal(isEmail(" user@example.com "), true);
  for (const bad of ["", "a@b", "a b@c.com", "@x.com", null, 5]) assert.equal(isEmail(bad), false);
});

test("isStrongPassword needs length, a letter and a number", () => {
  assert.equal(isStrongPassword("abcdefg1"), true);
  assert.equal(isStrongPassword("abcdefgh"), false);
  assert.equal(isStrongPassword("12345678"), false);
  assert.equal(isStrongPassword("a1"), false);
  assert.equal(isStrongPassword("a1".repeat(40)), false);
});

test("isPhone accepts common formats", () => {
  assert.equal(isPhone("+91 98765-43210"), true);
  assert.equal(isPhone("(555) 123-4567"), true);
  assert.equal(isPhone("12345"), false);
  assert.equal(isPhone("call me"), false);
});

test("isPostalCode is country aware", () => {
  assert.equal(isPostalCode("395007", "IN"), true);
  assert.equal(isPostalCode("39500", "IN"), false);
  assert.equal(isPostalCode("90210", "US"), true);
  assert.equal(isPostalCode("90210-1234", "us"), true);
  assert.equal(isPostalCode("SW1A 1AA", "GB"), true);
  assert.equal(isPostalCode("12345", "ZZ"), false);
});

test("isNonEmpty trims and enforces a maximum", () => {
  assert.equal(isNonEmpty("  x "), true);
  assert.equal(isNonEmpty("   "), false);
  assert.equal(isNonEmpty("x".repeat(101)), false);
  assert.equal(isNonEmpty("x".repeat(101), 200), true);
});
