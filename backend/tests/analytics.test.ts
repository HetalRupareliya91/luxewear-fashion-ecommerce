import test from "node:test";
import assert from "node:assert/strict";
import { averageOrderValue, revenueByDay, topProducts } from "../src/modules/analytics/summary.js";

const orders = [
  { createdAt: new Date("2026-10-02T10:00:00Z"), total: 10000, status: "PAID" },
  { createdAt: new Date("2026-10-01T23:00:00Z"), total: 5000, status: "DELIVERED" },
  { createdAt: new Date("2026-10-02T12:00:00Z"), total: 2000, status: "SHIPPED" },
  { createdAt: new Date("2026-10-02T13:00:00Z"), total: 9999, status: "CANCELLED" },
  { createdAt: new Date("2026-10-03T13:00:00Z"), total: 7777, status: "PENDING" },
];

test("revenueByDay counts only paid orders and sorts by date", () => {
  assert.deepEqual(revenueByDay(orders), [
    { date: "2026-10-01", revenue: 5000, orders: 1 },
    { date: "2026-10-02", revenue: 12000, orders: 2 },
  ]);
});

test("averageOrderValue ignores unpaid orders", () => {
  assert.equal(averageOrderValue(orders), Math.round(17000 / 3));
  assert.equal(averageOrderValue([]), 0);
});

test("topProducts ranks by units then revenue and respects the limit", () => {
  const items = [
    { productId: "a", name: "Blazer", quantity: 2, unitPrice: 18900 },
    { productId: "b", name: "Scarf", quantity: 3, unitPrice: 2900 },
    { productId: "a", name: "Blazer", quantity: 1, unitPrice: 18900 },
    { productId: "c", name: "Belt", quantity: 3, unitPrice: 4000 },
  ];
  const top = topProducts(items, 2);
  assert.deepEqual(top.map((t) => t.productId), ["a", "c"]);
  assert.equal(top[0].units, 3);
  assert.equal(top[0].revenue, 56700);
});
