import assert from "node:assert/strict";
import { test } from "node:test";
import { asBody, isCents, isIntBetween, isMissing, parseDate } from "../src/validators/helpers.js";

test("asBody only accepts plain objects", () => {
  assert.deepEqual(asBody({ a: 1 }), { a: 1 });
  assert.deepEqual(asBody(null), {});
  assert.deepEqual(asBody([1, 2]), {});
  assert.deepEqual(asBody("text"), {});
});

test("isCents allows whole non-negative amounts only", () => {
  assert.equal(isCents(0), true);
  assert.equal(isCents(1999), true);
  assert.equal(isCents(19.99), false);
  assert.equal(isCents(-1), false);
  assert.equal(isCents("5"), false);
  assert.equal(isCents(100_000_001), false);
});

test("isIntBetween checks type and range", () => {
  assert.equal(isIntBetween(5, 1, 5), true);
  assert.equal(isIntBetween(6, 1, 5), false);
  assert.equal(isIntBetween(2.5, 1, 5), false);
  assert.equal(isIntBetween(NaN, 1, 5), false);
});

test("parseDate reads Dates and ISO strings", () => {
  assert.equal(parseDate("2026-10-01T00:00:00Z")?.toISOString(), "2026-10-01T00:00:00.000Z");
  assert.equal(parseDate(new Date("2026-01-01"))?.getUTCFullYear(), 2026);
  assert.equal(parseDate("not a date"), null);
  assert.equal(parseDate(new Date("nope")), null);
  assert.equal(parseDate(5), null);
});

test("isMissing treats empty values as absent", () => {
  assert.equal(isMissing(undefined), true);
  assert.equal(isMissing(null), true);
  assert.equal(isMissing(""), true);
  assert.equal(isMissing(0), false);
});
