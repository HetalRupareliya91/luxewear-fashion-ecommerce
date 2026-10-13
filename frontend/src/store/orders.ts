import type { CheckoutForm } from "@/utils/validators";
import type { ShippingMethod, Totals } from "@/utils/cartTotals";

export const ORDERS_STORAGE_KEY = "luxewear.orders.v1";

export type OrderLine = { productId: string; name: string; size: string; quantity: number; price: number };
export type Order = {
  id: string;
  placedAt: string;
  customer: CheckoutForm;
  shippingMethod: ShippingMethod;
  lines: OrderLine[];
  totals: Totals;
};

/** LW-20261006-4821: prefix, UTC date and a 4 digit suffix (the API will assign real sequence numbers). */
export function makeOrderId(now: Date = new Date(), random: () => number = Math.random): string {
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `LW-${ymd}-${String(Math.floor(random() * 9000) + 1000)}`;
}

export function parseStoredOrders(raw: string | null): Order[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter((o): o is Order => !!o && typeof o.id === "string" && Array.isArray(o.lines)) : [];
  } catch {
    return [];
  }
}

export function loadOrders(): Order[] {
  return parseStoredOrders(window.localStorage.getItem(ORDERS_STORAGE_KEY));
}

export function saveOrder(order: Order): void {
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...loadOrders()].slice(0, 20)));
}
