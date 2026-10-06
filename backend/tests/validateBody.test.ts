import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/errors/AppError.js";
import { validateBody } from "../src/middleware/validateBody.js";
import { validateLogin } from "../src/validators/auth.js";
import { fakeNext, fakeReq, fakeRes } from "./helpers.js";

test("passes cleaned input to the next handler", () => {
  const req = fakeReq({ body: { email: " A@B.IO ", password: "pw" } });
  const { next, calls } = fakeNext();
  validateBody(validateLogin)(req, fakeRes(), next);
  assert.deepEqual(calls, [[]]);
  assert.deepEqual(req.body, { email: "a@b.io", password: "pw" });
});

test("forwards a 400 AppError with field errors", () => {
  const { next, calls } = fakeNext();
  validateBody(validateLogin)(fakeReq({ body: {} }), fakeRes(), next);
  const err = calls[0]?.[0] as AppError;
  assert.equal(err.statusCode, 400);
  assert.deepEqual(Object.keys(err.details as object).sort(), ["email", "password"]);
});
