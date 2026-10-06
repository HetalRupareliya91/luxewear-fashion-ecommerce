import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/errors/AppError.js";
import { errorHandler } from "../src/middleware/errorHandler.js";
import { fakeNext, fakeReq, fakeRes } from "./helpers.js";

test("AppError factories set the right status codes", () => {
  assert.equal(AppError.badRequest().statusCode, 400);
  assert.equal(AppError.unauthorized().statusCode, 401);
  assert.equal(AppError.forbidden().statusCode, 403);
  assert.equal(AppError.notFound().statusCode, 404);
  assert.equal(AppError.conflict().statusCode, 409);
});

test("errorHandler reports AppError with its status, message and details", () => {
  const res = fakeRes();
  errorHandler(AppError.badRequest("Validation failed", { email: "required" }), fakeReq(), res, fakeNext().next);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { success: false, message: "Validation failed", details: { email: "required" } });
});

test("errorHandler hides unexpected error details behind a 500", (t) => {
  t.mock.method(console, "error", () => {});
  const res = fakeRes();
  errorHandler(new Error("db password is hunter2"), fakeReq(), res, fakeNext().next);
  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { success: false, message: "Internal server error" });
});
