import test from "node:test";
import assert from "node:assert/strict";
import { amountToFreeShipping, shippingCost } from "../src/modules/shipping/shipping.js";

test("standard shipping is free from $150", () => {
  assert.equal(shippingCost("standard", 14999), 799);
  assert.equal(shippingCost("standard", 15000), 0);
});

test("express always costs and pickup is always free", () => {
  assert.equal(shippingCost("express", 99999), 1999);
  assert.equal(shippingCost("pickup", 0), 0);
});

test("amountToFreeShipping never goes negative", () => {
  assert.equal(amountToFreeShipping(10000), 5000);
  assert.equal(amountToFreeShipping(20000), 0);
});
