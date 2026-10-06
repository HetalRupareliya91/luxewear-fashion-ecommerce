import test from "node:test";
import assert from "node:assert/strict";
import { generateOrderNumber, parseOrderNumber } from "../src/modules/orders/order.number.js";

test("formats prefix, UTC date and padded sequence", () => {
  assert.equal(generateOrderNumber(new Date("2026-10-06T23:59:00Z"), 42), "LW-20261006-00042");
});

test("sequences beyond five digits keep growing", () => {
  assert.equal(generateOrderNumber(new Date("2026-01-02T00:00:00Z"), 123456), "LW-20260102-123456");
});

test("rejects invalid sequences", () => {
  for (const bad of [0, -1, 1.5, Number.NaN]) assert.throws(() => generateOrderNumber(new Date(), bad), RangeError);
});

test("parseOrderNumber round-trips and rejects junk", () => {
  assert.deepEqual(parseOrderNumber("LW-20261006-00042"), { date: "2026-10-06", sequence: 42 });
  assert.equal(parseOrderNumber("XX-1"), null);
});
