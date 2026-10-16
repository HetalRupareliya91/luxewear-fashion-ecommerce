import assert from "node:assert/strict";
import { test } from "node:test";
import { validateCheckout, validateQuote, validateStatusChange } from "../src/validators/orders.js";

const address = { firstName: "Asha", lastName: "Patel", line1: "12 MG Road", city: "Pune", postalCode: "411001", country: "in" };

test("a quote needs items and defaults to standard shipping", () => {
  const r = validateQuote({ items: [{ sku: "LW-001-M", quantity: 2 }] });
  assert.ok(r.ok);
  if (r.ok) assert.deepEqual(r.value, { items: [{ sku: "LW-001-M", quantity: 2 }], shippingMethod: "standard" });
  assert.equal(validateQuote({ items: [] }).ok, false);
  assert.equal(validateQuote({}).ok, false);
});

test("lines for the same SKU are merged", () => {
  const r = validateQuote({ items: [{ sku: "A1", quantity: 2 }, { sku: "A1", quantity: 3 }, { sku: "B1", quantity: 1 }] });
  assert.ok(r.ok);
  if (r.ok) assert.deepEqual(r.value.items, [{ sku: "A1", quantity: 5 }, { sku: "B1", quantity: 1 }]);
});

test("quantity is limited per SKU, even across merged lines", () => {
  assert.equal(validateQuote({ items: [{ sku: "A1", quantity: 21 }] }).ok, false);
  assert.equal(validateQuote({ items: [{ sku: "A1", quantity: 0 }] }).ok, false);
  assert.equal(validateQuote({ items: [{ sku: "A1", quantity: 1.5 }] }).ok, false);
  assert.equal(validateQuote({ items: [{ sku: "A1", quantity: 15 }, { sku: "A1", quantity: 15 }] }).ok, false);
});

test("too many lines are refused", () => {
  const items = Array.from({ length: 51 }, (_, i) => ({ sku: `S${i}`, quantity: 1 }));
  assert.equal(validateQuote({ items }).ok, false);
});

test("shipping method and coupon code are checked", () => {
  assert.equal(validateQuote({ items: [{ sku: "A1", quantity: 1 }], shippingMethod: "teleport" }).ok, false);
  const r = validateQuote({ items: [{ sku: "A1", quantity: 1 }], shippingMethod: "express", couponCode: " save10 " });
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.value.couponCode, "SAVE10");
    assert.equal(r.value.shippingMethod, "express");
  }
  assert.equal(validateQuote({ items: [{ sku: "A1", quantity: 1 }], couponCode: "no spaces!" }).ok, false);
});

test("checkout cleans the address", () => {
  const r = validateCheckout({ items: [{ sku: "A1", quantity: 1 }], shippingAddress: { ...address, phone: "+91 98765 43210" } });
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.value.shippingAddress.country, "IN");
    assert.equal(r.value.shippingAddress.phone, "+91 98765 43210");
    assert.equal("line2" in r.value.shippingAddress, false);
  }
});

test("checkout lists each bad address field", () => {
  const r = validateCheckout({ items: [{ sku: "A1", quantity: 1 }], shippingAddress: { firstName: "", lastName: "P", line1: "x", city: "", postalCode: "12", country: "India", phone: "abc" } });
  assert.equal(r.ok, false);
  if (!r.ok) {
    for (const key of ["firstName", "city", "country", "phone"]) assert.ok(r.errors[`shippingAddress.${key}`], key);
  }
});

test("an Indian postal code must be 6 digits", () => {
  const base = { items: [{ sku: "A1", quantity: 1 }] };
  const bad = validateCheckout({ ...base, shippingAddress: { ...address, postalCode: "4110" } });
  assert.equal(bad.ok, false);
  if (!bad.ok) assert.ok(bad.errors["shippingAddress.postalCode"]);
});

test("postal codes of unknown countries only need to be present and short", () => {
  const base = { items: [{ sku: "A1", quantity: 1 }] };
  assert.ok(validateCheckout({ ...base, shippingAddress: { ...address, country: "DE", postalCode: "10115" } }).ok);
  assert.equal(validateCheckout({ ...base, shippingAddress: { ...address, country: "DE", postalCode: "" } }).ok, false);
});

test("validateStatusChange accepts known statuses only", () => {
  assert.ok(validateStatusChange({ status: "SHIPPED" }).ok);
  assert.equal(validateStatusChange({ status: "LOST" }).ok, false);
  assert.equal(validateStatusChange(null).ok, false);
});
