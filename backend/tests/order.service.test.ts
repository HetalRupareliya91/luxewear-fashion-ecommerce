import assert from "node:assert/strict";
import { test } from "node:test";
import { createOrderService } from "../src/modules/orders/order.service.js";
import { createMemoryCoupons } from "./helpers/memoryCoupons.js";
import { createMemoryOrders } from "./helpers/memoryOrders.js";

const address = { firstName: "Asha", lastName: "Patel", line1: "12 MG Road", city: "Pune", postalCode: "411001", country: "IN" };
const now = () => new Date("2026-10-10T10:00:00Z");

function make() {
  const orders = createMemoryOrders();
  const coupons = createMemoryCoupons([{ code: "SAVE10", type: "PERCENT", value: 10, active: true }]);
  return { orders, service: createOrderService({ orders, coupons, now }) };
}
const checkout = (extra: Record<string, unknown> = {}) => ({ items: [{ sku: "LW-001-M", quantity: 2 }], shippingMethod: "standard" as const, shippingAddress: address, ...extra });

test("quote prices lines on the server and adds shipping and tax", async () => {
  const { service } = make();
  const q = await service.quote({ items: [{ sku: "LW-001-M", quantity: 2 }], shippingMethod: "standard" });
  assert.equal(q.subtotal, 11800);
  assert.equal(q.shipping, 799);
  assert.equal(q.tax, 944);
  assert.equal(q.total, 11800 + 944 + 799);
  assert.equal(q.items[0].unitPrice, 5900);
  assert.equal(q.amountToFreeShipping, 15000 - 11800);
});

test("free shipping applies over the threshold", async () => {
  const { service } = make();
  const q = await service.quote({ items: [{ sku: "LW-002-S", quantity: 1 }], shippingMethod: "standard" });
  assert.equal(q.shipping, 0);
  assert.equal(q.amountToFreeShipping, 0);
});

test("a coupon lowers the total; a bad coupon is reported on quotes", async () => {
  const { service } = make();
  const withCoupon = await service.quote({ items: [{ sku: "LW-001-M", quantity: 2 }], shippingMethod: "pickup", couponCode: "SAVE10" });
  assert.equal(withCoupon.discount, 1180);
  const bad = await service.quote({ items: [{ sku: "LW-001-M", quantity: 2 }], shippingMethod: "pickup", couponCode: "NOPE1" });
  assert.equal(bad.couponError, "Coupon code not found");
  assert.equal(bad.discount, 0);
});

test("unknown SKUs are 404 and short stock is 409", async () => {
  const { service } = make();
  await assert.rejects(service.quote({ items: [{ sku: "NOPE", quantity: 1 }], shippingMethod: "standard" }), { statusCode: 404 });
  await assert.rejects(service.quote({ items: [{ sku: "LW-001-L", quantity: 2 }], shippingMethod: "standard" }), { statusCode: 409 });
});

test("placing an order stores server-side prices and takes stock", async () => {
  const { service, orders } = make();
  const order = await service.place({ id: "u1", email: "a@b.co" }, checkout());
  assert.equal(order.number, "LW-20261010-00001");
  assert.equal(order.status, "PENDING");
  assert.equal(order.userId, "u1");
  assert.equal(order.items[0].unitPrice, 5900);
  assert.equal(orders.stockOf("LW-001-M"), 8);
  const second = await service.place({ id: "u1", email: "a@b.co" }, checkout());
  assert.equal(second.number, "LW-20261010-00002");
});

test("placing an order with a bad coupon is refused and takes no stock", async () => {
  const { service, orders } = make();
  await assert.rejects(service.place({ id: "u1", email: "a@b.co" }, checkout({ couponCode: "NOPE1" })), { statusCode: 400 });
  assert.equal(orders.stockOf("LW-001-M"), 10);
});

test("two orders cannot both take the last item", async () => {
  const { service } = make();
  const last = checkout({ items: [{ sku: "LW-001-L", quantity: 1 }] });
  await service.place({ id: "u1", email: "a@b.co" }, last);
  await assert.rejects(service.place({ id: "u2", email: "c@d.co" }, last), { statusCode: 409 });
});

test("customers only see their own orders", async () => {
  const { service } = make();
  const mine = await service.place({ id: "u1", email: "a@b.co" }, checkout());
  await service.place({ id: "u2", email: "c@d.co" }, checkout());
  const list = await service.listMine("u1", { skip: 0, limit: 10, page: 1 });
  assert.equal(list.items.length, 1);
  assert.equal(list.meta.total, 1);
  assert.equal((await service.getMine("u1", mine.id)).id, mine.id);
  await assert.rejects(service.getMine("u2", mine.id), { statusCode: 404 });
});

test("an unpaid order can be cancelled and the stock comes back", async () => {
  const { service, orders } = make();
  const order = await service.place({ id: "u1", email: "a@b.co" }, checkout());
  const cancelled = await service.cancelMine("u1", order.id);
  assert.equal(cancelled.status, "CANCELLED");
  assert.equal(orders.stockOf("LW-001-M"), 10);
  await assert.rejects(service.cancelMine("u1", order.id), { statusCode: 409 });
});

test("a paid order cannot be cancelled by the customer", async () => {
  const { service } = make();
  const order = await service.place({ id: "u1", email: "a@b.co" }, checkout());
  await service.updateStatus(order.id, "PAID");
  await assert.rejects(service.cancelMine("u1", order.id), { statusCode: 409 });
});

test("admin status changes follow the allowed flow", async () => {
  const { service, orders } = make();
  const order = await service.place({ id: "u1", email: "a@b.co" }, checkout());
  await assert.rejects(service.updateStatus(order.id, "SHIPPED"), { statusCode: 409 });
  for (const status of ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const) assert.equal((await service.updateStatus(order.id, status)).status, status);
  assert.equal(orders.stockOf("LW-001-M"), 8);
  await assert.rejects(service.updateStatus("missing", "PAID"), { statusCode: 404 });
});

test("an admin cancellation restocks but a refund does not", async () => {
  const { service, orders } = make();
  const a = await service.place({ id: "u1", email: "a@b.co" }, checkout());
  await service.updateStatus(a.id, "PAID");
  await service.updateStatus(a.id, "CANCELLED");
  assert.equal(orders.stockOf("LW-001-M"), 10);
  const b = await service.place({ id: "u1", email: "a@b.co" }, checkout());
  await service.updateStatus(b.id, "PAID");
  await service.updateStatus(b.id, "REFUNDED");
  assert.equal(orders.stockOf("LW-001-M"), 8);
});

test("listAll filters by status", async () => {
  const { service } = make();
  const a = await service.place({ id: "u1", email: "a@b.co" }, checkout());
  await service.place({ id: "u2", email: "c@d.co" }, checkout());
  await service.updateStatus(a.id, "PAID");
  assert.equal((await service.listAll({ skip: 0, limit: 10, page: 1 })).meta.total, 2);
  assert.equal((await service.listAll({ status: "PAID", skip: 0, limit: 10, page: 1 })).items.length, 1);
});
