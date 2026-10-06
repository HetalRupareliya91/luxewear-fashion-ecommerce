import test from "node:test";
import assert from "node:assert/strict";
import { sendError, sendSuccess } from "../src/utils/apiResponse.js";
import { fakeRes } from "./helpers.js";

test("sendSuccess wraps data and optional meta", () => {
  const res = fakeRes();
  sendSuccess(res, [1, 2], 200, { page: 1 });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { success: true, data: [1, 2], meta: { page: 1 } });
});

test("sendSuccess omits meta when not given and supports 201", () => {
  const res = fakeRes();
  sendSuccess(res, { id: "x" }, 201);
  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body, { success: true, data: { id: "x" } });
});

test("sendError includes details only when provided", () => {
  const a = fakeRes();
  sendError(a, 404, "Not found");
  assert.deepEqual(a.body, { success: false, message: "Not found" });
  const b = fakeRes();
  sendError(b, 400, "Bad", { email: "required" });
  assert.deepEqual(b.body, { success: false, message: "Bad", details: { email: "required" } });
});
