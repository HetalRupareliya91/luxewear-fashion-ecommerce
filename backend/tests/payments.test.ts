import assert from "node:assert/strict";
import { test } from "node:test";
import { createOrderService } from "../src/modules/orders/order.service.js";
import { mockProvider } from "../src/modules/payments/payment.provider.js";
import { createPaymentRouter } from "../src/modules/payments/payment.router.js";
import { createPaymentService } from "../src/modules/payments/payment.service.js";
import { signPayload } from "../src/modules/payments/signature.js";
import { createMemoryCoupons } from "./helpers/memoryCoupons.js";
import { createMemoryOrders } from "./helpers/memoryOrders.js";
import { asUser, startServer, TEST_SECRET } from "./helpers/testServer.js";

const WEBHOOK_SECRET = "whsec_test";
const address = { firstName: "Asha", lastName: "Patel", line1: "12 MG Road", city: "Pune", postalCode: "411001", country: "IN" };

async function setup() {
  const orders = createMemoryOrders();
  const orderService = createOrderService({ orders, coupons: createMemoryCoupons() });
  const order = await orderService.place({ id: "u1", email: "a@b.co" }, { items: [{ sku: "LW-001-M", quantity: 1 }], shippingMethod: "standard", shippingAddress: address });
  const service = createPaymentService({ orders, provider: mockProvider });
  const server = await startServer((app) => app.use("/payments", createPaymentRouter({ service, secret: TEST_SECRET, webhookSecret: WEBHOOK_SECRET })));
  const webhook = (event: object, secret = WEBHOOK_SECRET) => {
    const raw = JSON.stringify(event);
    return server.call("POST", "/payments/webhook", { rawBody: raw, headers: { "x-signature": signPayload(raw, secret) } });
  };
  return { orders, order, server, webhook };
}

test("the mock provider makes predictable references", async () => {
  const intent = await mockProvider.createIntent({ orderNumber: "LW-1", amount: 100, currency: "USD" });
  assert.deepEqual(intent, { reference: "mock_LW-1", clientSecret: "mock_LW-1_secret" });
});

test("a customer starts a payment for their own pending order", async () => {
  const { server, order, orders } = await setup();
  try {
    assert.equal((await server.post("/payments/intent", { orderId: order.id })).status, 401);
    assert.equal((await server.post("/payments/intent", { orderId: order.id }, asUser("u2"))).status, 404);
    assert.equal((await server.post("/payments/intent", {}, asUser("u1"))).status, 400);

    const res = await server.post("/payments/intent", { orderId: order.id }, asUser("u1"));
    assert.equal(res.status, 201);
    assert.equal(res.json.data.reference, `mock_${order.number}`);
    assert.equal(res.json.data.amount, order.total);
    assert.equal((await orders.findById(order.id))?.paymentRef, `mock_${order.number}`);
  } finally {
    await server.close();
  }
});

test("a signed success event marks the order paid, and repeating it is harmless", async () => {
  const { server, order, orders, webhook } = await setup();
  try {
    await server.post("/payments/intent", { orderId: order.id }, asUser("u1"));
    const event = { type: "payment.succeeded", reference: `mock_${order.number}` };
    const first = await webhook(event);
    assert.equal(first.status, 200);
    assert.deepEqual(first.json.data, { handled: true, status: "PAID" });
    assert.equal((await orders.findById(order.id))?.status, "PAID");
    assert.deepEqual((await webhook(event)).json.data, { handled: true, status: "PAID" });
  } finally {
    await server.close();
  }
});

test("a failed payment leaves the order pending", async () => {
  const { server, order, orders, webhook } = await setup();
  try {
    await server.post("/payments/intent", { orderId: order.id }, asUser("u1"));
    const res = await webhook({ type: "payment.failed", reference: `mock_${order.number}` });
    assert.deepEqual(res.json.data, { handled: true, status: "PENDING" });
    assert.equal((await orders.findById(order.id))?.status, "PENDING");
  } finally {
    await server.close();
  }
});

test("unknown references and unknown event types are ignored", async () => {
  const { server, webhook } = await setup();
  try {
    assert.deepEqual((await webhook({ type: "payment.succeeded", reference: "mock_unknown" })).json.data, { handled: false });
  } finally {
    await server.close();
  }
});

test("a wrong or missing signature is rejected and changes nothing", async () => {
  const { server, order, orders, webhook } = await setup();
  try {
    await server.post("/payments/intent", { orderId: order.id }, asUser("u1"));
    const event = { type: "payment.succeeded", reference: `mock_${order.number}` };
    assert.equal((await webhook(event, "wrong-secret")).status, 401);
    assert.equal((await server.call("POST", "/payments/webhook", { rawBody: JSON.stringify(event) })).status, 401);
    assert.equal((await orders.findById(order.id))?.status, "PENDING");
    assert.equal((await webhook({ nothing: true })).status, 400);
  } finally {
    await server.close();
  }
});

test("a paid order cannot start another payment", async () => {
  const { server, order, webhook } = await setup();
  try {
    await server.post("/payments/intent", { orderId: order.id }, asUser("u1"));
    await webhook({ type: "payment.succeeded", reference: `mock_${order.number}` });
    assert.equal((await server.post("/payments/intent", { orderId: order.id }, asUser("u1"))).status, 409);
  } finally {
    await server.close();
  }
});
