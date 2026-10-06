import test from "node:test";
import assert from "node:assert/strict";
import { requestId } from "../src/middleware/requestId.js";
import { fakeNext, fakeReq, fakeRes } from "./helpers.js";

test("generates an id when none is sent", () => {
  const res = fakeRes();
  const { next, calls } = fakeNext();
  requestId(fakeReq(), res, next);
  assert.match(String(res.headers["X-Request-Id"]), /^[0-9a-f-]{36}$/);
  assert.equal(res.locals.requestId, res.headers["X-Request-Id"]);
  assert.equal(calls.length, 1);
});

test("reuses a well formed incoming id", () => {
  const res = fakeRes();
  requestId(fakeReq({ headers: { "X-Request-Id": "abc-12345.xyz" } }), res, fakeNext().next);
  assert.equal(res.headers["X-Request-Id"], "abc-12345.xyz");
});

test("replaces a malformed incoming id", () => {
  const res = fakeRes();
  requestId(fakeReq({ headers: { "X-Request-Id": "bad id with spaces" } }), res, fakeNext().next);
  assert.notEqual(res.headers["X-Request-Id"], "bad id with spaces");
});
