import assert from "node:assert/strict";
import { test } from "node:test";
import { createAdminOrderRouter, createCheckoutRouter, createOrderRouter } from "../src/modules/orders/order.router.js";
import { createOrderService } from "../src/modules/orders/order.service.js";
import { createMemoryCoupons } from "./helpers/memoryCoupons.js";
import { createMemoryOrders } from "./helpers/memoryOrders.js";
import { createMemoryUsers } from "./helpers/memoryUsers.js";
import { asAdmin, asUser, startServer, TEST_SECRET } from "./helpers/testServer.js";

const address = { firstName: "Asha", lastName: "Patel", line1: "12 MG Road", city: "Pune", postalCode: "411001", country: "IN" };
const body = (extra: Record<string, unknown> = {}) => ({ items: [{ sku: "LW-001-M", quantity: 2 }], shippingMethod: "standard", shippingAddress: address, ...extra });

async function setup() {
  const users = createMemoryUsers();
  const u1 = await users.create({ email: "asha@example.com", passwordHash: "x", firstName: "Asha" });
  const u2 = await users.create({ email: "ravi@example.com", passwordHash: "x", firstName: "Ravi" });
  const orders = createMemoryOrders();
  const service = createOrderService({ orders, coupons: createMemoryCoupons([{ code: "SAVE10", type: "PERCENT", value: 10, active: true }]) });
  const server = await startServer((app) => {
    app.use("/orders", createOrderRouter({ service, users, secret: TEST_SECRET }));
    app.use("/admin/orders", createAdminOrderRouter({ service, secret: TEST_SECRET }));
    app.use("/checkout", createCheckoutRouter({ service }));
  });
  return { server, orders, a: asUser(u1.id), b: asUser(u2.id) };
}

test("quote is public and returns server-side totals", async () => {
  const { server } = await setup();
  try {
    const res = await server.post("/checkout/quote", { items: [{ sku: "LW-001-M", quantity: 1 }], couponCode: "SAVE10" });
    assert.equal(res.status, 200);
    assert.equal(res.json.data.subtotal, 5900);
    assert.equal(res.json.data.discount, 590);
    assert.equal((await server.post("/checkout/quote", { items: [] })).status, 400);
    assert.equal((await server.post("/checkout/quote", { items: [{ sku: "NOPE", quantity: 1 }] })).status, 404);
  } finally {
    await server.close();
  }
});

test("orders need a signed-in user", async () => {
  const { server } = await setup();
  try {
    assert.equal((await server.post("/orders", body())).status, 401);
    assert.equal((await server.get("/orders")).status, 401);
  } finally {
    await server.close();
  }
});

test("a customer places, lists and reads an order", async () => {
  const { server, orders, a } = await setup();
  try {
    const placed = await server.post("/orders", body(), a);
    assert.equal(placed.status, 201);
    assert.equal(placed.json.data.status, "PENDING");
    assert.equal(placed.json.data.email, "asha@example.com");
    assert.match(placed.json.data.number, /^LW-\d{8}-00001$/);
    assert.equal(orders.stockOf("LW-001-M"), 8);

    const list = await server.get("/orders", a);
    assert.equal(list.json.data.length, 1);
    assert.equal(list.json.meta.total, 1);

    const one = await server.get(`/orders/${placed.json.data.id}`, a);
    assert.equal(one.status, 200);
    assert.equal(one.json.data.total, placed.json.data.total);
  } finally {
    await server.close();
  }
});

test("prices sent by the client are ignored", async () => {
  const { server, a } = await setup();
  try {
    const placed = await server.post("/orders", body({ items: [{ sku: "LW-001-M", quantity: 1, unitPrice: 1 }], total: 1 }), a);
    assert.equal(placed.status, 201);
    assert.equal(placed.json.data.subtotal, 5900);
  } finally {
    await server.close();
  }
});

test("invalid checkout bodies are rejected with field errors", async () => {
  const { server, a } = await setup();
  try {
    const res = await server.post("/orders", body({ shippingAddress: { ...address, city: "" } }), a);
    assert.equal(res.status, 400);
    assert.ok(res.json.details["shippingAddress.city"]);
  } finally {
    await server.close();
  }
});

test("another customer cannot read or cancel an order", async () => {
  const { server, a, b } = await setup();
  try {
    const placed = await server.post("/orders", body(), a);
    const id = placed.json.data.id;
    assert.equal((await server.get(`/orders/${id}`, b)).status, 404);
    assert.equal((await server.post(`/orders/${id}/cancel`, undefined, b)).status, 404);
    assert.equal((await server.post(`/orders/${id}/cancel`, undefined, a)).status, 200);
  } finally {
    await server.close();
  }
});

test("a token for a deleted account cannot place orders", async () => {
  const { server } = await setup();
  try {
    assert.equal((await server.post("/orders", body(), asUser("ghost"))).status, 401);
  } finally {
    await server.close();
  }
});

test("admin routes need the admin role", async () => {
  const { server, a } = await setup();
  try {
    assert.equal((await server.get("/admin/orders")).status, 401);
    assert.equal((await server.get("/admin/orders", a)).status, 403);
  } finally {
    await server.close();
  }
});

test("an admin lists orders and moves one through the flow", async () => {
  const { server, a } = await setup();
  try {
    const placed = await server.post("/orders", body(), a);
    const id = placed.json.data.id;
    const all = await server.get("/admin/orders?status=pending", asAdmin());
    assert.equal(all.json.data.length, 1);
    assert.equal((await server.get("/admin/orders?status=PAID", asAdmin())).json.data.length, 0);

    assert.equal((await server.patch(`/admin/orders/${id}/status`, { status: "SHIPPED" }, asAdmin())).status, 409);
    assert.equal((await server.patch(`/admin/orders/${id}/status`, { status: "BOGUS" }, asAdmin())).status, 400);
    const paid = await server.patch(`/admin/orders/${id}/status`, { status: "PAID" }, asAdmin());
    assert.equal(paid.json.data.status, "PAID");
    assert.equal((await server.get(`/admin/orders/${id}`, asAdmin())).json.data.status, "PAID");
    assert.equal((await server.get("/admin/orders/missing", asAdmin())).status, 404);
  } finally {
    await server.close();
  }
});
