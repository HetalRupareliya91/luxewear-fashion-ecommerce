import assert from "node:assert/strict";
import { test } from "node:test";
import { createProductAdminService } from "../src/modules/products/product.admin.js";
import { createProductAdminRouter } from "../src/modules/products/product.admin.router.js";
import { createMemoryProducts } from "./helpers/memoryProducts.js";
import { asAdmin, asUser, startServer, TEST_SECRET } from "./helpers/testServer.js";

const input = (extra: Record<string, unknown> = {}) => ({ name: "Linen Shirt", price: 59, categoryId: "c1", variants: [{ sku: "LW-001-M", size: "M", stock: 5 }], ...extra });

async function setup() {
  const repo = createMemoryProducts();
  const server = await startServer((app) => app.use("/admin/products", createProductAdminRouter({ service: createProductAdminService({ products: repo }), secret: TEST_SECRET })));
  return { server, repo };
}

test("the catalogue can only be managed by admins", async () => {
  const { server } = await setup();
  try {
    assert.equal((await server.get("/admin/products")).status, 401);
    assert.equal((await server.post("/admin/products", input(), asUser("u1"))).status, 403);
  } finally {
    await server.close();
  }
});

test("creating a product makes a draft with a slug", async () => {
  const { server } = await setup();
  try {
    const res = await server.post("/admin/products", input(), asAdmin());
    assert.equal(res.status, 201);
    assert.equal(res.json.data.slug, "linen-shirt");
    assert.equal(res.json.data.status, "DRAFT");
    assert.equal(res.json.data.variants[0].stock, 5);
  } finally {
    await server.close();
  }
});

test("a second product with the same name gets a different slug", async () => {
  const { server } = await setup();
  try {
    await server.post("/admin/products", input(), asAdmin());
    const second = await server.post("/admin/products", input({ variants: [{ sku: "LW-009-M", stock: 1 }] }), asAdmin());
    assert.equal(second.json.data.slug, "linen-shirt-2");
  } finally {
    await server.close();
  }
});

test("duplicate SKUs, unknown categories and bad input are refused", async () => {
  const { server } = await setup();
  try {
    await server.post("/admin/products", input(), asAdmin());
    assert.equal((await server.post("/admin/products", input({ name: "Other" }), asAdmin())).status, 409);
    const noCategory = await server.post("/admin/products", input({ categoryId: "zzz", variants: [{ sku: "NEW-1", stock: 1 }] }), asAdmin());
    assert.equal(noCategory.status, 400);
    assert.ok(noCategory.json.details.categoryId);
    assert.equal((await server.post("/admin/products", { name: "" }, asAdmin())).status, 400);
  } finally {
    await server.close();
  }
});

test("a product can be edited, listed, filtered and archived", async () => {
  const { server } = await setup();
  try {
    const id = (await server.post("/admin/products", input(), asAdmin())).json.data.id;
    const edited = await server.patch(`/admin/products/${id}`, { price: 49.5, status: "ACTIVE" }, asAdmin());
    assert.equal(edited.json.data.price, 49.5);
    assert.equal(edited.json.data.status, "ACTIVE");
    assert.equal((await server.patch(`/admin/products/${id}`, { categoryId: "zzz" }, asAdmin())).status, 400);
    assert.equal((await server.patch(`/admin/products/${id}`, {}, asAdmin())).status, 400);
    assert.equal((await server.patch("/admin/products/missing", { price: 5 }, asAdmin())).status, 404);

    assert.equal((await server.get("/admin/products?status=active", asAdmin())).json.data.length, 1);
    assert.equal((await server.get("/admin/products?status=draft", asAdmin())).json.data.length, 0);
    assert.equal((await server.get("/admin/products?q=linen", asAdmin())).json.data.length, 1);
    assert.equal((await server.get(`/admin/products/${id}`, asAdmin())).json.data.id, id);

    const archived = await server.del(`/admin/products/${id}`, asAdmin());
    assert.equal(archived.json.data.status, "ARCHIVED");
    assert.equal((await server.del("/admin/products/missing", asAdmin())).status, 404);
  } finally {
    await server.close();
  }
});

test("stock is changed by SKU", async () => {
  const { server, repo } = await setup();
  try {
    await server.post("/admin/products", input(), asAdmin());
    const res = await server.patch("/admin/products/variants/LW-001-M/stock", { stock: 42 }, asAdmin());
    assert.deepEqual(res.json.data, { sku: "LW-001-M", stock: 42 });
    assert.equal(repo.items[0].variants[0].stock, 42);
    assert.equal((await server.patch("/admin/products/variants/NOPE/stock", { stock: 1 }, asAdmin())).status, 404);
    assert.equal((await server.patch("/admin/products/variants/LW-001-M/stock", { stock: -1 }, asAdmin())).status, 400);
  } finally {
    await server.close();
  }
});
