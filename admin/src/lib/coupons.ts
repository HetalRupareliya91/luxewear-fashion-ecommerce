import type { AdminCoupon } from "./types";

/** The sample data is "as of" this date so the pages look the same on every visit. */
export const SAMPLE_NOW = new Date("2026-10-10T00:00:00Z");

export type CouponState = "active" | "expired" | "used up" | "inactive";

export function couponState(c: AdminCoupon, now: Date = SAMPLE_NOW): CouponState {
  if (!c.active) return "inactive";
  if (c.expiresAt && now > new Date(c.expiresAt)) return "expired";
  if (c.usageLimit !== undefined && c.usedCount >= c.usageLimit) return "used up";
  return "active";
}

export const couponLabel = (c: AdminCoupon): string => (c.type === "PERCENT" ? `${c.value}% off` : `$${c.value.toFixed(2)} off`);
