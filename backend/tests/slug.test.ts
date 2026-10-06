import test from "node:test";
import assert from "node:assert/strict";
import { slugify, uniqueSlug } from "../src/utils/slug.js";

test("slugify lowercases, strips accents and symbols", () => {
  assert.equal(slugify("Satin Slip Dress!"), "satin-slip-dress");
  assert.equal(slugify("Café & Crème"), "cafe-and-creme");
  assert.equal(slugify("  --Hello   World--  "), "hello-world");
});

test("slugify of symbols only is empty", () => {
  assert.equal(slugify("!!!"), "");
});

test("slugify caps the length without a trailing dash", () => {
  const out = slugify("a ".repeat(100));
  assert.ok(out.length <= 80);
  assert.ok(!out.endsWith("-"));
});

test("uniqueSlug appends the next free number", () => {
  assert.equal(uniqueSlug("Blazer", []), "blazer");
  assert.equal(uniqueSlug("Blazer", ["blazer"]), "blazer-2");
  assert.equal(uniqueSlug("Blazer", ["blazer", "blazer-2"]), "blazer-3");
  assert.equal(uniqueSlug("???", []), "item");
});
