import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCoupon, type Coupon } from "../src/modules/coupons/coupon.rules.js";

const base: Coupon = { code: "SAVE10", type: "PERCENT", value: 10, active: true };
const now = new Date("2026-10-06T10:00:00Z");

test("percent coupons discount the subtotal", () => {
  assert.deepEqual(evaluateCoupon(base, 20000, now), { valid: true, discount: 2000 });
});

test("fixed coupons never exceed the order and maxDiscount caps percent coupons", () => {
  assert.deepEqual(evaluateCoupon({ ...base, type: "FIXED", value: 5000 }, 3000, now), { valid: true, discount: 3000 });
  assert.deepEqual(evaluateCoupon({ ...base, value: 50, maxDiscount: 1500 }, 20000, now), { valid: true, discount: 1500 });
});

test("inactive, early, expired and used-up coupons are rejected with a reason", () => {
  assert.equal(evaluateCoupon({ ...base, active: false }, 1000, now).valid, false);
  assert.equal(evaluateCoupon({ ...base, startsAt: new Date("2026-11-01") }, 1000, now).valid, false);
  assert.equal(evaluateCoupon({ ...base, expiresAt: new Date("2026-10-01") }, 1000, now).valid, false);
  const used = evaluateCoupon({ ...base, usageLimit: 5, usedCount: 5 }, 1000, now);
  assert.equal(used.valid, false);
  if (!used.valid) assert.match(used.reason, /usage limit/);
});

test("minimum subtotal is enforced", () => {
  assert.equal(evaluateCoupon({ ...base, minSubtotal: 10000 }, 9999, now).valid, false);
  assert.equal(evaluateCoupon({ ...base, minSubtotal: 10000 }, 10000, now).valid, true);
});

test("out-of-range percent values are clamped", () => {
  assert.deepEqual(evaluateCoupon({ ...base, value: 500 }, 1000, now), { valid: true, discount: 1000 });
  assert.deepEqual(evaluateCoupon({ ...base, value: -5 }, 1000, now), { valid: true, discount: 0 });
});
