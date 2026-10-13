import { REVENUE_STATUSES } from "./orderStatus";
import { orderTotal } from "./orders";
import type { AdminOrder, AdminProduct } from "./types";

/** Revenue and orders per UTC day for orders that count as revenue; sorted by date. */
export function revenueByDay(orders: AdminOrder[]) {
  const days = new Map<string, { date: string; revenue: number; orders: number }>();
  for (const o of orders) {
    if (!REVENUE_STATUSES.includes(o.status)) continue;
    const date = o.createdAt.slice(0, 10);
    const day = days.get(date) ?? { date, revenue: 0, orders: 0 };
    day.revenue = Math.round((day.revenue + orderTotal(o)) * 100) / 100;
    day.orders += 1;
    days.set(date, day);
  }
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/** Best sellers by units (ties: revenue, then name). Cancelled/refunded/pending orders are ignored. */
export function topProducts(orders: AdminOrder[], products: AdminProduct[], limit = 5) {
  const rows = new Map<string, { productId: string; name: string; units: number; revenue: number }>();
  for (const o of orders) {
    if (!REVENUE_STATUSES.includes(o.status)) continue;
    for (const item of o.items) {
      const name = products.find((p) => p.id === item.productId)?.name ?? item.productId;
      const row = rows.get(item.productId) ?? { productId: item.productId, name, units: 0, revenue: 0 };
      row.units += item.quantity;
      row.revenue += item.quantity * item.unitPrice;
      rows.set(item.productId, row);
    }
  }
  return [...rows.values()].sort((a, b) => b.units - a.units || b.revenue - a.revenue || a.name.localeCompare(b.name)).slice(0, limit);
}

export function averageOrderValue(orders: AdminOrder[]): number {
  const paid = orders.filter((o) => REVENUE_STATUSES.includes(o.status));
  return paid.length ? Math.round((paid.reduce((s, o) => s + orderTotal(o), 0) / paid.length) * 100) / 100 : 0;
}
