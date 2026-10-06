import test from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter } from "../src/middleware/rateLimit.js";
import { fakeNext, fakeReq, fakeRes } from "./helpers.js";

function hit(limiter: ReturnType<typeof createRateLimiter>, ip = "1.1.1.1") {
  const res = fakeRes();
  const { next, calls } = fakeNext();
  limiter(fakeReq({ ip }), res, next);
  return { res, passed: calls.length === 1 };
}

test("allows requests up to max, then answers 429 with Retry-After", () => {
  const limiter = createRateLimiter({ max: 2, windowMs: 60_000, now: () => 0 });
  assert.equal(hit(limiter).passed, true);
  assert.equal(hit(limiter).passed, true);
  const blocked = hit(limiter);
  assert.equal(blocked.passed, false);
  assert.equal(blocked.res.statusCode, 429);
  assert.equal(blocked.res.headers["Retry-After"], "60");
});

test("counts each client separately", () => {
  const limiter = createRateLimiter({ max: 1, now: () => 0 });
  assert.equal(hit(limiter, "a").passed, true);
  assert.equal(hit(limiter, "b").passed, true);
  assert.equal(hit(limiter, "a").passed, false);
});

test("the window resets after windowMs", () => {
  let t = 0;
  const limiter = createRateLimiter({ max: 1, windowMs: 1000, now: () => t });
  assert.equal(hit(limiter).passed, true);
  assert.equal(hit(limiter).passed, false);
  t = 1001;
  assert.equal(hit(limiter).passed, true);
});
