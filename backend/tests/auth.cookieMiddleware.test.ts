import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/errors/AppError.js";
import { requireAuth } from "../src/middleware/auth.js";
import { signToken } from "../src/modules/auth/token.js";
import { fakeNext, fakeReq, fakeRes } from "./helpers.js";

const secret = "cookie-secret";
const token = signToken({ sub: "u1", role: "CUSTOMER" }, secret);

test("requireAuth accepts the login cookie", () => {
  const res = fakeRes();
  const { next, calls } = fakeNext();
  requireAuth(secret)(fakeReq({ headers: { Cookie: `theme=dark; lw_token=${encodeURIComponent(token)}` } }), res, next);
  assert.deepEqual(calls, [[]]);
  assert.equal((res.locals.user as { sub: string }).sub, "u1");
});

test("a Bearer header takes precedence over the cookie", () => {
  const other = signToken({ sub: "bearer-user", role: "ADMIN" }, secret);
  const res = fakeRes();
  requireAuth(secret)(fakeReq({ headers: { Authorization: `Bearer ${other}`, Cookie: `lw_token=${token}` } }), res, fakeNext().next);
  assert.equal((res.locals.user as { sub: string }).sub, "bearer-user");
});

test("a forged or empty cookie is a 401", () => {
  for (const cookie of ["lw_token=forged.value", "lw_token=", "other=1"]) {
    const { next, calls } = fakeNext();
    requireAuth(secret)(fakeReq({ headers: { Cookie: cookie } }), fakeRes(), next);
    assert.equal((calls[0]?.[0] as AppError).statusCode, 401);
  }
});
