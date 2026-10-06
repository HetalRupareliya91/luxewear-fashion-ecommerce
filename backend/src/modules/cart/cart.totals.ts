import { evaluateCoupon, type Coupon } from "../coupons/coupon.rules.js";
import { shippingCost, type ShippingMethod } from "../shipping/shipping.js";
import { calculateTax } from "../tax/tax.js";
import type { Cents } from "../../utils/money.js";

export type CartLine = { unitPrice: Cents; quantity: number };

export type CartTotals = {
  subtotal: Cents;
  discount: Cents;
  shipping: Cents;
  tax: Cents;
  total: Cents;
  couponError?: string;
};

/** Order of operations: subtotal - discount = taxable; tax on taxable only; shipping is added last and not taxed. */
export function calculateCartTotals(input: {
  lines: CartLine[];
  coupon?: Coupon;
  shippingMethod?: ShippingMethod;
  taxRatePercent?: number;
  now?: Date;
}): CartTotals {
  const subtotal = input.lines.reduce((sum, l) => sum + l.unitPrice * Math.max(Math.floor(l.quantity), 0), 0);

  let discount = 0;
  let couponError: string | undefined;
  if (input.coupon) {
    const result = evaluateCoupon(input.coupon, subtotal, input.now);
    if (result.valid) discount = result.discount;
    else couponError = result.reason;
  }

  const taxable = subtotal - discount;
  const shipping = subtotal === 0 ? 0 : shippingCost(input.shippingMethod ?? "standard", taxable);
  const tax = calculateTax(taxable, input.taxRatePercent);
  return { subtotal, discount, shipping, tax, total: taxable + tax + shipping, ...(couponError ? { couponError } : {}) };
}
