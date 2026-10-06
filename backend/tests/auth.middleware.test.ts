import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/errors/AppError.js";
import { requireAuth, requireRole } from "../src/middleware/auth.js";
import { signToken } from "../src/modules/auth/token.js";
import { fakeNext, fakeReq, fakeRes } from "./helpers.js";

const secret = "s3cret";

test("requireAuth accepts a valid bearer token and exposes the user", () => {
  const token = signToken({ sub: "u1", role: "CUSTOMER" }, secret);
  const res = fakeRes();
  const { next, calls } = fakeNext();
  requireAuth(secret)(fakeReq({ headers: { Authorization: `Bearer ${token}` } }), res, next);
  assert.deepEqual(calls, [[]]);
  assert.equal((res.locals.user as { sub: string }).sub, "u1");
});

test("requireAuth rejects missing, malformed or forged tokens with 401", () => {
  for (const header of [undefined, "Bearer", "Token abc", "Bearer not.a.token"]) {
    const { next, calls } = fakeNext();
    requireAuth(secret)(fakeReq({ headers: header ? { Authorization: header } : {} }), fakeRes(), next);
    const err = calls[0]?.[0] as AppError;
    assert.equal(err.statusCode, 401);
  }
});

test("requireRole allows listed roles and blocks others with 403", () => {
  const admin = fakeRes();
  admin.locals.user = { sub: "a", role: "ADMIN" };
  const ok = fakeNext();
  requireRole("ADMIN")(fakeReq(), admin, ok.next);
  assert.deepEqual(ok.calls, [[]]);

  const customer = fakeRes();
  customer.locals.user = { sub: "c", role: "CUSTOMER" };
  const denied = fakeNext();
  requireRole("ADMIN")(fakeReq(), customer, denied.next);
  assert.equal((denied.calls[0]?.[0] as AppError).statusCode, 403);
});

test("requireRole without a user is 401", () => {
  const { next, calls } = fakeNext();
  requireRole("ADMIN")(fakeReq(), fakeRes(), next);
  assert.equal((calls[0]?.[0] as AppError).statusCode, 401);
});
