import assert from "node:assert/strict";
import { test } from "node:test";
import { validateReview } from "../src/validators/reviews.js";

const good = { productId: "p1", rating: 5, body: "Fits perfectly and feels great." };

test("a good review is trimmed and accepted", () => {
  const r = validateReview({ ...good, productId: " p1 ", title: " Love it ", body: "  Fits perfectly and feels great.  " });
  assert.ok(r.ok);
  if (r.ok) assert.deepEqual(r.value, { productId: "p1", rating: 5, title: "Love it", body: "Fits perfectly and feels great." });
});

test("title is optional", () => {
  const r = validateReview(good);
  assert.ok(r.ok);
  if (r.ok) assert.equal("title" in r.value, false);
});

test("rating must be a whole number from 1 to 5", () => {
  for (const rating of [0, 6, 3.5, "5", null]) assert.equal(validateReview({ ...good, rating }).ok, false, String(rating));
});

test("body needs 10 to 2000 characters", () => {
  assert.equal(validateReview({ ...good, body: "too short" }).ok, false);
  assert.equal(validateReview({ ...good, body: "x".repeat(2001) }).ok, false);
  assert.equal(validateReview({ ...good, body: "x".repeat(2000) }).ok, true);
});

test("errors are listed per field", () => {
  const r = validateReview({ rating: 9, title: "t".repeat(101) });
  assert.equal(r.ok, false);
  if (!r.ok) for (const key of ["productId", "rating", "body", "title"]) assert.ok(r.errors[key], key);
});
