import test from "node:test";
import assert from "node:assert/strict";
import { buildMeta, parsePagination } from "../src/utils/pagination.js";

test("defaults when nothing is given", () => {
  assert.deepEqual(parsePagination({}), { page: 1, limit: 20, skip: 0 });
});

test("computes skip and clamps values", () => {
  assert.deepEqual(parsePagination({ page: "3", limit: "10" }), { page: 3, limit: 10, skip: 20 });
  assert.equal(parsePagination({ limit: "9999" }, { maxLimit: 50 }).limit, 50);
  assert.equal(parsePagination({ limit: "-4" }).limit, 1);
  assert.equal(parsePagination({ page: "0" }).page, 1);
  assert.equal(parsePagination({ page: "abc" }).page, 1);
});

test("buildMeta reports at least one page", () => {
  assert.deepEqual(buildMeta(1, 20, 0), { page: 1, limit: 20, total: 0, pages: 1 });
  assert.equal(buildMeta(2, 20, 41).pages, 3);
});
