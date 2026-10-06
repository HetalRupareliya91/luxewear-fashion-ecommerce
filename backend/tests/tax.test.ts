import test from "node:test";
import assert from "node:assert/strict";
import { calculateTax, splitInclusive } from "../src/modules/tax/tax.js";

test("calculateTax rounds to the nearest cent", () => {
  assert.equal(calculateTax(10000), 800);
  assert.equal(calculateTax(1999, 8), 160);
  assert.equal(calculateTax(10000, 18), 1800);
});

test("no tax on zero, negative amounts or zero rate", () => {
  assert.equal(calculateTax(0), 0);
  assert.equal(calculateTax(-500), 0);
  assert.equal(calculateTax(10000, 0), 0);
});

test("splitInclusive always adds back up to the gross price", () => {
  for (const gross of [1180, 9999, 12345]) {
    const { net, tax } = splitInclusive(gross, 18);
    assert.equal(net + tax, gross);
  }
  assert.deepEqual(splitInclusive(1180, 18), { net: 1000, tax: 180 });
});
