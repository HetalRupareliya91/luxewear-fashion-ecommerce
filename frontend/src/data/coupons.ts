/** Demo promo codes (the real rules will live in the API: see backend/src/modules/coupons). */
export const DEMO_COUPONS: Record<string, { percent: number; label: string }> = {
  WELCOME10: { percent: 10, label: "10% off your order" },
};

export function findCoupon(code: string) {
  const key = code.trim().toUpperCase();
  const coupon = DEMO_COUPONS[key];
  return coupon ? { code: key, ...coupon } : null;
}
