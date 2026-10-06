import test from "node:test";
import assert from "node:assert/strict";
import { calculateCartTotals } from "../src/modules/cart/cart.totals.js";

const lines = [
  { unitPrice: 12900, quantity: 1 },
  { unitPrice: 4500, quantity: 2 },
]; // subtotal 21900

test("totals without a coupon (free standard shipping, 8% tax)", () => {
  assert.deepEqual(calculateCartTotals({ lines }), { subtotal: 21900, discount: 0, shipping: 0, tax: 1752, total: 23652 });
});

test("a coupon reduces the taxable amount", () => {
  const t = calculateCartTotals({ lines, coupon: { code: "TEN", type: "PERCENT", value: 10, active: true } });
  assert.equal(t.discount, 2190);
  assert.equal(t.tax, 1577); // 8% of 19710
  assert.equal(t.total, 19710 + 1577);
});

test("an invalid coupon is reported and ignored", () => {
  const t = calculateCartTotals({ lines, coupon: { code: "OLD", type: "FIXED", value: 500, active: false } });
  assert.equal(t.discount, 0);
  assert.match(t.couponError ?? "", /not active/);
});

test("shipping is charged below the free threshold and is not taxed", () => {
  const t = calculateCartTotals({ lines: [{ unitPrice: 5000, quantity: 1 }] });
  assert.equal(t.shipping, 799);
  assert.equal(t.tax, 400);
  assert.equal(t.total, 5000 + 400 + 799);
});

test("an empty cart costs nothing; bad quantities count as zero", () => {
  assert.deepEqual(calculateCartTotals({ lines: [] }), { subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 });
  assert.equal(calculateCartTotals({ lines: [{ unitPrice: 1000, quantity: -3 }] }).subtotal, 0);
});
