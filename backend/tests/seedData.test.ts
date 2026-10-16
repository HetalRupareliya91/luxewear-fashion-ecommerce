import assert from "node:assert/strict";
import { test } from "node:test";
import { validateCoupon } from "../src/validators/coupons.js";
import { SEED_COUPONS, SEED_PRODUCTS, skuFor } from "../scripts/seedData.js";

test("skuFor follows the storefront convention", () => {
  assert.equal(skuFor("lw-001", "M"), "LW-001-M");
  assert.equal(skuFor("lw-005", "One size"), "LW-005-ONESIZE");
  assert.equal(skuFor("lw-006", "32"), "LW-006-32");
});

test("every seeded SKU is unique and passes the admin SKU rule", () => {
  const skus = SEED_PRODUCTS.flatMap((p) => p.sizes.map((s) => skuFor(p.key, s)));
  assert.equal(new Set(skus).size, skus.length);
  for (const sku of skus) assert.match(sku, /^[A-Za-z0-9._-]{3,40}$/);
});

test("seeded prices have at most two decimals and keys are unique", () => {
  for (const p of SEED_PRODUCTS) assert.equal(Math.round(p.price * 100) / 100, p.price);
  assert.equal(new Set(SEED_PRODUCTS.map((p) => p.key)).size, SEED_PRODUCTS.length);
});

test("seeded coupons are valid coupons", () => {
  for (const coupon of SEED_COUPONS) assert.ok(validateCoupon(coupon).ok, coupon.code);
});
