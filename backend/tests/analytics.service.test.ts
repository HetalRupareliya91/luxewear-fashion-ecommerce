import assert from "node:assert/strict";
import { test } from "node:test";
import { createAnalyticsRouter } from "../src/modules/analytics/analytics.router.js";
import { clampDays, createAnalyticsService, type AnalyticsRepository } from "../src/modules/analytics/analytics.service.js";
import { asAdmin, asUser, startServer, TEST_SECRET } from "./helpers/testServer.js";

const NOW = new Date("2026-10-10T12:00:00Z");
const repo = (seen: { since?: Date } = {}): AnalyticsRepository => ({
  async ordersSince(since) {
    seen.since = since;
    return [
      { createdAt: new Date("2026-10-08T09:00:00Z"), total: 10000, status: "PAID" },
      { createdAt: new Date("2026-10-08T15:00:00Z"), total: 5000, status: "DELIVERED" },
      { createdAt: new Date("2026-10-09T09:00:00Z"), total: 7000, status: "CANCELLED" },
    ];
  },
  async itemsSince() {
    return [
      { productId: "p1", name: "Linen Shirt", quantity: 3, unitPrice: 5000 },
      { productId: "p2", name: "Wool Coat", quantity: 1, unitPrice: 18900 },
    ];
  },
  async counts() {
    return { customers: 12, products: 30, pendingOrders: 2 };
  },
});

test("clampDays keeps the range between 1 and 365", () => {
  assert.equal(clampDays("7"), 7);
  assert.equal(clampDays("0"), 1);
  assert.equal(clampDays("9999"), 365);
  assert.equal(clampDays("abc"), 30);
  assert.equal(clampDays(undefined), 30);
});

test("summary adds up paid orders only and reads the right window", async () => {
  const seen: { since?: Date } = {};
  const service = createAnalyticsService({ repo: repo(seen), now: () => NOW });
  const s = await service.summary(7);
  assert.equal(seen.since?.toISOString(), "2026-10-03T12:00:00.000Z");
  assert.equal(s.revenue, 15000);
  assert.equal(s.orders, 2);
  assert.equal(s.averageOrderValue, 7500);
  assert.deepEqual(s.revenueByDay, [{ date: "2026-10-08", revenue: 15000, orders: 2 }]);
  assert.equal(s.topProducts[0].productId, "p1");
  assert.equal(s.customers, 12);
  assert.equal(s.pendingOrders, 2);
});

test("GET /admin/summary is admin only and honours ?days", async () => {
  const service = createAnalyticsService({ repo: repo(), now: () => NOW });
  const server = await startServer((app) => app.use("/admin", createAnalyticsRouter({ service, secret: TEST_SECRET })));
  try {
    assert.equal((await server.get("/admin/summary")).status, 401);
    assert.equal((await server.get("/admin/summary", asUser("u1"))).status, 403);
    const res = await server.get("/admin/summary?days=14", asAdmin());
    assert.equal(res.status, 200);
    assert.equal(res.json.data.days, 14);
    assert.equal((await server.get("/admin/summary?days=100000", asAdmin())).json.data.days, 365);
  } finally {
    await server.close();
  }
});
