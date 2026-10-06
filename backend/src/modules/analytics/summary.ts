import type { Cents } from "../../utils/money.js";

export type OrderRecord = { createdAt: Date; total: Cents; status: string };
export type OrderItemRecord = { productId: string; name: string; quantity: number; unitPrice: Cents };

const COUNTED = new Set(["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]);

/** Revenue and order count per UTC day for orders that were actually paid. Sorted by date. */
export function revenueByDay(orders: OrderRecord[]) {
  const days = new Map<string, { date: string; revenue: Cents; orders: number }>();
  for (const o of orders) {
    if (!COUNTED.has(o.status)) continue;
    const date = o.createdAt.toISOString().slice(0, 10);
    const day = days.get(date) ?? { date, revenue: 0, orders: 0 };
    day.revenue += o.total;
    day.orders += 1;
    days.set(date, day);
  }
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/** Best sellers by units sold (ties broken by revenue, then name). */
export function topProducts(items: OrderItemRecord[], limit = 5) {
  const map = new Map<string, { productId: string; name: string; units: number; revenue: Cents }>();
  for (const i of items) {
    const row = map.get(i.productId) ?? { productId: i.productId, name: i.name, units: 0, revenue: 0 };
    row.units += i.quantity;
    row.revenue += i.quantity * i.unitPrice;
    map.set(i.productId, row);
  }
  return [...map.values()]
    .sort((a, b) => b.units - a.units || b.revenue - a.revenue || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export const averageOrderValue = (orders: OrderRecord[]): Cents => {
  const paid = orders.filter((o) => COUNTED.has(o.status));
  return paid.length ? Math.round(paid.reduce((s, o) => s + o.total, 0) / paid.length) : 0;
};
