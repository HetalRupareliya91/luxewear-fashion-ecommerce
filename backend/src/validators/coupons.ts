import type { Coupon } from "../modules/coupons/coupon.rules.js";
import { asBody, isCents, isIntBetween, isMissing, parseDate } from "./helpers.js";
import { type ValidationResult } from "./primitives.js";

export const COUPON_CODE_RE = /^[A-Z0-9_-]{3,32}$/;

export const normalizeCouponCode = (code: unknown): string => (typeof code === "string" ? code.trim().toUpperCase() : "");

/** Checks a coupon sent by an admin. `usedCount` is never accepted; the server owns it. */
export function validateCoupon(input: unknown): ValidationResult<Coupon> {
  const body = asBody(input);
  const errors: Record<string, string> = {};

  const code = normalizeCouponCode(body.code);
  if (!COUPON_CODE_RE.test(code)) errors.code = "Use 3-32 letters, numbers, dashes or underscores";

  const type = body.type;
  if (type !== "PERCENT" && type !== "FIXED") errors.type = "Type must be PERCENT or FIXED";
  else if (type === "PERCENT" && !isIntBetween(body.value, 1, 100)) errors.value = "A percent coupon needs a whole number from 1 to 100";
  else if (type === "FIXED" && !(isCents(body.value) && body.value > 0)) errors.value = "A fixed coupon needs an amount in cents above 0";

  if (body.active !== undefined && typeof body.active !== "boolean") errors.active = "Active must be true or false";
  if (!isMissing(body.minSubtotal) && !isCents(body.minSubtotal)) errors.minSubtotal = "Minimum must be an amount in cents";
  if (!isMissing(body.maxDiscount) && !isCents(body.maxDiscount)) errors.maxDiscount = "Maximum discount must be an amount in cents";
  if (!isMissing(body.usageLimit) && !isIntBetween(body.usageLimit, 1, 10_000_000)) errors.usageLimit = "Usage limit must be a whole number of 1 or more";

  const startsAt = isMissing(body.startsAt) ? undefined : parseDate(body.startsAt);
  const expiresAt = isMissing(body.expiresAt) ? undefined : parseDate(body.expiresAt);
  if (startsAt === null) errors.startsAt = "Enter a valid start date";
  if (expiresAt === null) errors.expiresAt = "Enter a valid expiry date";
  if (startsAt && expiresAt && expiresAt <= startsAt) errors.expiresAt = "Expiry must be after the start date";

  if (Object.keys(errors).length) return { ok: false, errors };

  const coupon: Coupon = { code, type: type as Coupon["type"], value: body.value as number, active: body.active !== false };
  if (!isMissing(body.minSubtotal)) coupon.minSubtotal = body.minSubtotal as number;
  if (!isMissing(body.maxDiscount)) coupon.maxDiscount = body.maxDiscount as number;
  if (!isMissing(body.usageLimit)) coupon.usageLimit = body.usageLimit as number;
  if (startsAt) coupon.startsAt = startsAt;
  if (expiresAt) coupon.expiresAt = expiresAt;
  return { ok: true, value: coupon };
}

export type CouponCheckInput = { code: string; subtotal: number };

/** Body of POST /coupons/validate: the code and the cart subtotal in cents. */
export function validateCouponCheck(input: unknown): ValidationResult<CouponCheckInput> {
  const body = asBody(input);
  const errors: Record<string, string> = {};
  const code = normalizeCouponCode(body.code);
  if (!COUPON_CODE_RE.test(code)) errors.code = "Enter a coupon code";
  if (!isCents(body.subtotal)) errors.subtotal = "Subtotal must be an amount in cents";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { code, subtotal: body.subtotal as number } };
}
