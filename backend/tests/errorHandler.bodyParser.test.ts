import test from "node:test";
import assert from "node:assert/strict";
import { errorHandler } from "../src/middleware/errorHandler.js";
import { fakeNext, fakeReq, fakeRes } from "./helpers.js";

test("malformed JSON from express.json() becomes a 400, not a 500", () => {
  const res = fakeRes();
  errorHandler(Object.assign(new SyntaxError("Unexpected token"), { status: 400, type: "entity.parse.failed" }), fakeReq(), res, fakeNext().next);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { success: false, message: "Invalid request body" });
});

test("an oversized body becomes a 413", () => {
  const res = fakeRes();
  errorHandler(Object.assign(new Error("too large"), { status: 413, type: "entity.too.large" }), fakeReq(), res, fakeNext().next);
  assert.equal(res.statusCode, 413);
});

test("errors that merely have a status but no parser type are still hidden behind a 500", (t) => {
  t.mock.method(console, "error", () => {});
  const res = fakeRes();
  errorHandler(Object.assign(new Error("secret db detail"), { status: 400 }), fakeReq(), res, fakeNext().next);
  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { success: false, message: "Internal server error" });
});
