import test from "node:test";
import assert from "node:assert/strict";
import { signToken, verifyToken } from "../src/modules/auth/token.js";

const secret = "test-secret";

test("round trip returns the payload", () => {
  const token = signToken({ sub: "u1", role: "ADMIN" }, secret, 60, 0);
  assert.deepEqual(verifyToken(token, secret, 1000), { sub: "u1", role: "ADMIN", exp: 60 });
});

test("a different secret is rejected", () => {
  const token = signToken({ sub: "u1", role: "CUSTOMER" }, secret);
  assert.equal(verifyToken(token, "other-secret"), null);
});

test("a tampered payload is rejected", () => {
  const token = signToken({ sub: "u1", role: "CUSTOMER" }, secret);
  const [, sig] = token.split(".");
  const forged = Buffer.from(JSON.stringify({ sub: "u1", role: "ADMIN", exp: 9999999999 })).toString("base64url");
  assert.equal(verifyToken(`${forged}.${sig}`, secret), null);
});

test("expired tokens are rejected", () => {
  const token = signToken({ sub: "u1", role: "CUSTOMER" }, secret, 10, 0);
  assert.notEqual(verifyToken(token, secret, 9_000), null);
  assert.equal(verifyToken(token, secret, 11_000), null);
});

test("garbage never verifies", () => {
  for (const bad of ["", "abc", "a.b.c", "."]) assert.equal(verifyToken(bad, secret), null);
});
