import type { Cents } from "../../utils/money.js";

export type ShippingMethod = "standard" | "express" | "pickup";

export const FREE_SHIPPING_THRESHOLD: Cents = 15000; // $150.00
export const SHIPPING_RATES: Record<ShippingMethod, Cents> = { standard: 799, express: 1999, pickup: 0 };

/** Standard shipping is free over the threshold; express always costs; pickup is free. */
export function shippingCost(method: ShippingMethod, subtotal: Cents): Cents {
  if (method === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_RATES[method];
}

/** How much more the customer must spend for free standard shipping (0 when already free). */
export function amountToFreeShipping(subtotal: Cents): Cents {
  return Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
}
