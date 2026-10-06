import test from "node:test";
import assert from "node:assert/strict";
import { formatMoney, fromCents, percentOf, toCents } from "../src/utils/money.js";

test("toCents converts decimals and numeric strings", () => {
  assert.equal(toCents(19.99), 1999);
  assert.equal(toCents("129.00"), 12900);
  assert.equal(toCents(0), 0);
});

test("toCents avoids float drift when adding", () => {
  assert.equal(toCents("0.1") + toCents("0.2"), toCents("0.3"));
});

test("toCents rejects non numbers", () => {
  assert.throws(() => toCents("abc"), RangeError);
  assert.throws(() => toCents(Number.NaN), RangeError);
});

test("fromCents and formatMoney", () => {
  assert.equal(fromCents(12999), 129.99);
  assert.equal(formatMoney(12999), "$129.99");
  assert.equal(formatMoney(-100), "-$1.00");
});

test("percentOf rounds to the nearest cent", () => {
  assert.equal(percentOf(1999, 10), 200);
  assert.equal(percentOf(10000, 15), 1500);
});
