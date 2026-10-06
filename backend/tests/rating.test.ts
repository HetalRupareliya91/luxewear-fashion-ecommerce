import test from "node:test";
import assert from "node:assert/strict";
import { summarizeRatings } from "../src/modules/reviews/rating.js";

test("averages to one decimal and builds the distribution", () => {
  assert.deepEqual(summarizeRatings([5, 4, 4, 3]), { count: 4, average: 4, distribution: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 1 } });
  assert.equal(summarizeRatings([5, 5, 4]).average, 4.7);
});

test("invalid ratings are ignored", () => {
  const s = summarizeRatings([5, 0, 6, 2.5, Number.NaN, 3]);
  assert.equal(s.count, 2);
  assert.equal(s.average, 4);
});

test("no ratings gives zeros", () => {
  assert.deepEqual(summarizeRatings([]), { count: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
});
