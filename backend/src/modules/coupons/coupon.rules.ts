import { percentOf, type Cents } from "../../utils/money.js";

export type Coupon = {
  code: string;
  type: "PERCENT" | "FIXED";
  /** PERCENT: 1-100. FIXED: amount in cents. */
  value: number;
  active: boolean;
  minSubtotal?: Cents;
  maxDiscount?: Cents;
  startsAt?: Date;
  expiresAt?: Date;
  usageLimit?: number;
  usedCount?: number;
};

export type CouponResult = { valid: true; discount: Cents } | { valid: false; reason: string };

export function evaluateCoupon(coupon: Coupon, subtotal: Cents, now: Date = new Date()): CouponResult {
  if (!coupon.active) return { valid: false, reason: "This coupon is not active" };
  if (coupon.startsAt && now < coupon.startsAt) return { valid: false, reason: "This coupon is not valid yet" };
  if (coupon.expiresAt && now > coupon.expiresAt) return { valid: false, reason: "This coupon has expired" };
  if (coupon.usageLimit !== undefined && (coupon.usedCount ?? 0) >= coupon.usageLimit) {
    return { valid: false, reason: "This coupon has reached its usage limit" };
  }
  if (coupon.minSubtotal !== undefined && subtotal < coupon.minSubtotal) {
    return { valid: false, reason: "Your order does not reach the minimum amount for this coupon" };
  }

  let discount = coupon.type === "PERCENT" ? percentOf(subtotal, Math.min(Math.max(coupon.value, 0), 100)) : coupon.value;
  if (coupon.maxDiscount !== undefined) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(Math.max(discount, 0), subtotal); // never discount more than the order
  return { valid: true, discount };
}
