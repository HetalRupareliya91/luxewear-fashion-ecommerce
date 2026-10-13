import { REVENUE_STATUSES } from "./orderStatus";
import { orderTotal } from "./orders";
import type { AdminOrder, AdminProduct, Customer } from "./types";

export const LOW_STOCK_THRESHOLD = 10;

export function dashboardStats(orders: AdminOrder[], customers: Customer[], products: AdminProduct[]) {
  const revenueOrders = orders.filter((o) => REVENUE_STATUSES.includes(o.status));
  return {
    revenue: Math.round(revenueOrders.reduce((s, o) => s + orderTotal(o), 0) * 100) / 100,
    orders: orders.length,
    openOrders: orders.filter((o) => o.status === "PENDING" || o.status === "PAID" || o.status === "PROCESSING").length,
    customers: customers.length,
    activeProducts: products.filter((p) => p.status === "active").length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };
}

export type StockLevel = "out" | "low" | "ok";
export const stockLevel = (stock: number): StockLevel => (stock === 0 ? "out" : stock <= LOW_STOCK_THRESHOLD ? "low" : "ok");
