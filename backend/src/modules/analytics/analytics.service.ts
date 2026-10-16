import { averageOrderValue, revenueByDay, topProducts, type OrderItemRecord, type OrderRecord } from "./summary.js";

export type AnalyticsRepository = {
  ordersSince(since: Date): Promise<OrderRecord[]>;
  /** Items of orders that count as sales (paid or later). */
  itemsSince(since: Date): Promise<OrderItemRecord[]>;
  counts(): Promise<{ customers: number; products: number; pendingOrders: number }>;
};

export type AnalyticsService = ReturnType<typeof createAnalyticsService>;

export const clampDays = (value: unknown, fallback = 30): number => {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, 1), 365) : fallback;
};

export function createAnalyticsService({ repo, now = () => new Date() }: { repo: AnalyticsRepository; now?: () => Date }) {
  return {
    /** Numbers for the admin dashboard over the last `days` days. */
    async summary(days: number) {
      const range = clampDays(days);
      const since = new Date(now().getTime() - range * 24 * 60 * 60 * 1000);
      const [orders, items, counts] = await Promise.all([repo.ordersSince(since), repo.itemsSince(since), repo.counts()]);
      const daily = revenueByDay(orders);
      return {
        days: range,
        revenue: daily.reduce((sum, d) => sum + d.revenue, 0),
        orders: daily.reduce((sum, d) => sum + d.orders, 0),
        averageOrderValue: averageOrderValue(orders),
        revenueByDay: daily,
        topProducts: topProducts(items, 5),
        ...counts,
      };
    },
  };
}
