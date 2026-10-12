export type ShippingMethod = "standard" | "express" | "pickup";

export const FREE_SHIPPING_THRESHOLD = 150;
export const SHIPPING_RATES: Record<ShippingMethod, number> = { standard: 7.99, express: 19.99, pickup: 0 };
export const TAX_RATE_PERCENT = 8;

export type Totals = { subtotal: number; discount: number; shipping: number; tax: number; total: number };

const toCents = (dollars: number) => Math.round(dollars * 100);
const toDollars = (cents: number) => cents / 100;

/** Same rules as backend/src/modules/cart/cart.totals.ts: tax is charged after the discount; shipping is not taxed. */
export function calculateTotals(
  lines: { price: number; quantity: number }[],
  shippingMethod: ShippingMethod = "standard",
  couponPercent = 0,
): Totals {
  const subtotal = lines.reduce((sum, l) => sum + toCents(l.price) * Math.max(Math.floor(l.quantity), 0), 0);
  const discount = Math.min(Math.round((subtotal * Math.min(Math.max(couponPercent, 0), 100)) / 100), subtotal);
  const taxable = subtotal - discount;
  const freeShipping = shippingMethod === "standard" && taxable >= toCents(FREE_SHIPPING_THRESHOLD);
  const shipping = subtotal === 0 || freeShipping ? 0 : toCents(SHIPPING_RATES[shippingMethod]);
  const tax = taxable > 0 ? Math.round((taxable * TAX_RATE_PERCENT) / 100) : 0;
  return {
    subtotal: toDollars(subtotal),
    discount: toDollars(discount),
    shipping: toDollars(shipping),
    tax: toDollars(tax),
    total: toDollars(taxable + tax + shipping),
  };
}

export const amountToFreeShipping = (subtotal: number): number => Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
