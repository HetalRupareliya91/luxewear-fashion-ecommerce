import assert from "node:assert/strict";
import { test } from "node:test";
import { isPrice, validateProduct, validateProductPatch, validateStockChange } from "../src/validators/products.js";

const good = { name: " Linen Shirt ", price: 59.9, categoryId: "c1", variants: [{ sku: "LW-001-M", size: "M", stock: 5 }] };

test("isPrice allows dollars with at most two decimals", () => {
  assert.equal(isPrice(59), true);
  assert.equal(isPrice(59.99), true);
  assert.equal(isPrice(59.999), false);
  assert.equal(isPrice(0), false);
  assert.equal(isPrice(-1), false);
  assert.equal(isPrice("5"), false);
  assert.equal(isPrice(100_001), false);
});

test("a new product gets safe defaults", () => {
  const r = validateProduct(good);
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.value.name, "Linen Shirt");
    assert.equal(r.value.status, "DRAFT");
    assert.equal(r.value.gender, "UNISEX");
    assert.deepEqual(r.value.images, []);
    assert.deepEqual(r.value.variants, [{ sku: "LW-001-M", size: "M", stock: 5 }]);
  }
});

test("variants are checked one by one", () => {
  const r = validateProduct({ ...good, variants: [{ sku: "ok-1", stock: -1 }, { sku: "ok-1", stock: 1 }, { sku: "a", stock: 1.5 }, { sku: "fine-2", stock: 1, price: 0 }] });
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.ok(r.errors["variants.0.stock"]);
    assert.ok(r.errors["variants.1.sku"]);
    assert.ok(r.errors["variants.2.sku"]);
    assert.ok(r.errors["variants.3.price"]);
  }
  assert.equal(validateProduct({ ...good, variants: [] }).ok, false);
});

test("images need http(s) URLs", () => {
  assert.ok(validateProduct({ ...good, images: [{ url: "https://cdn.example.com/a.jpg", altText: "Front" }] }).ok);
  const bad = validateProduct({ ...good, images: [{ url: "javascript:alert(1)" }, { url: "not a url" }] });
  assert.equal(bad.ok, false);
  if (!bad.ok) {
    assert.ok(bad.errors["images.0.url"]);
    assert.ok(bad.errors["images.1.url"]);
  }
});

test("name, price, category, gender and status are required or checked", () => {
  const r = validateProduct({ variants: good.variants, gender: "ROBOT", status: "LIVE" });
  assert.equal(r.ok, false);
  if (!r.ok) for (const key of ["name", "price", "categoryId", "gender", "status"]) assert.ok(r.errors[key], key);
});

test("a patch changes only what was sent", () => {
  const r = validateProductPatch({ price: 49.5, status: "ACTIVE", name: " New " });
  assert.ok(r.ok);
  if (r.ok) assert.deepEqual(r.value, { price: 49.5, status: "ACTIVE", name: "New" });
  assert.equal(validateProductPatch({}).ok, false);
  assert.equal(validateProductPatch({ price: -3 }).ok, false);
  assert.equal(validateProductPatch({ status: "LIVE" }).ok, false);
  const clear = validateProductPatch({ description: "" });
  assert.ok(clear.ok);
});

test("stock changes need a whole number", () => {
  assert.ok(validateStockChange({ stock: 0 }).ok);
  assert.equal(validateStockChange({ stock: -1 }).ok, false);
  assert.equal(validateStockChange({ stock: "5" }).ok, false);
});
