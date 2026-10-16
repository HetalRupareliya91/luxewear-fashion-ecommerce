import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeCouponCode, validateCoupon, validateCouponCheck } from "../src/validators/coupons.js";

test("normalizeCouponCode trims and upper-cases", () => {
  assert.equal(normalizeCouponCode("  save10 "), "SAVE10");
  assert.equal(normalizeCouponCode(5), "");
});

test("a percent coupon is accepted and cleaned", () => {
  const r = validateCoupon({ code: " welcome10 ", type: "PERCENT", value: 10, minSubtotal: 5000, startsAt: "2026-01-01", expiresAt: "2026-12-31" });
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.value.code, "WELCOME10");
    assert.equal(r.value.active, true);
    assert.equal(r.value.minSubtotal, 5000);
    assert.ok(r.value.expiresAt instanceof Date);
    assert.equal("usedCount" in r.value, false);
  }
});

test("usedCount in the input is ignored", () => {
  const r = validateCoupon({ code: "ABC", type: "FIXED", value: 500, usedCount: 99 });
  assert.ok(r.ok);
  if (r.ok) assert.equal("usedCount" in r.value, false);
});

test("percent must be 1-100 and fixed must be positive cents", () => {
  assert.equal(validateCoupon({ code: "ABC", type: "PERCENT", value: 0 }).ok, false);
  assert.equal(validateCoupon({ code: "ABC", type: "PERCENT", value: 101 }).ok, false);
  assert.equal(validateCoupon({ code: "ABC", type: "PERCENT", value: 12.5 }).ok, false);
  assert.equal(validateCoupon({ code: "ABC", type: "FIXED", value: 0 }).ok, false);
  assert.equal(validateCoupon({ code: "ABC", type: "FIXED", value: 5.5 }).ok, false);
  assert.equal(validateCoupon({ code: "ABC", type: "OTHER", value: 5 }).ok, false);
});

test("bad codes, dates and limits are reported per field", () => {
  const r = validateCoupon({ code: "a b", type: "FIXED", value: 100, startsAt: "2026-05-01", expiresAt: "2026-04-01", usageLimit: 0, minSubtotal: -5 });
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.ok(r.errors.code);
    assert.ok(r.errors.expiresAt);
    assert.ok(r.errors.usageLimit);
    assert.ok(r.errors.minSubtotal);
  }
});

test("empty optional fields count as not provided", () => {
  const r = validateCoupon({ code: "ABC", type: "FIXED", value: 100, minSubtotal: "", expiresAt: null });
  assert.ok(r.ok);
  if (r.ok) assert.equal(r.value.minSubtotal, undefined);
});

test("validateCouponCheck needs a code and a cents subtotal", () => {
  const ok = validateCouponCheck({ code: "save10", subtotal: 8000 });
  assert.ok(ok.ok);
  if (ok.ok) assert.deepEqual(ok.value, { code: "SAVE10", subtotal: 8000 });
  assert.equal(validateCouponCheck({ code: "", subtotal: 1 }).ok, false);
  assert.equal(validateCouponCheck({ code: "SAVE10", subtotal: 9.99 }).ok, false);
});
