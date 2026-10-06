import test from "node:test";
import assert from "node:assert/strict";
import { parseProductQuery } from "../src/modules/products/product.query.js";

test("defaults", () => {
  assert.deepEqual(parseProductQuery({}), { sort: "newest", page: 1, limit: 12, skip: 0 });
});

test("category men/women are treated as gender", () => {
  const q = parseProductQuery({ category: "Women" });
  assert.equal(q.gender, "WOMEN");
  assert.equal(q.category, undefined);
  assert.equal(parseProductQuery({ category: "dresses" }).category, "dresses");
});

test("price range is parsed and swapped when reversed", () => {
  const q = parseProductQuery({ minPrice: "200", maxPrice: "50" });
  assert.deepEqual([q.minPrice, q.maxPrice], [50, 200]);
  assert.equal(parseProductQuery({ minPrice: "abc" }).minPrice, undefined);
  assert.equal(parseProductQuery({ maxPrice: "-5" }).maxPrice, undefined);
});

test("sort is whitelisted, search accepts q or search, arrays use the first value", () => {
  assert.equal(parseProductQuery({ sort: "price-desc" }).sort, "price-desc");
  assert.equal(parseProductQuery({ sort: "DROP TABLE" }).sort, "newest");
  assert.equal(parseProductQuery({ q: " blazer " }).search, "blazer");
  assert.equal(parseProductQuery({ search: ["coat", "x"] }).search, "coat");
});

test("pagination is clamped to 48 per page", () => {
  assert.equal(parseProductQuery({ limit: "500" }).limit, 48);
  assert.equal(parseProductQuery({ page: "3", limit: "10" }).skip, 20);
});
