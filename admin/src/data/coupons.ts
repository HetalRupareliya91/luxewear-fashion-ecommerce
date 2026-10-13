import type { AdminCoupon } from "@/lib/types";

export const adminCoupons: AdminCoupon[] = [
  { code: "WELCOME10", type: "PERCENT", value: 10, active: true, usageLimit: 500, usedCount: 128 },
  { code: "FREESHIP", type: "FIXED", value: 7.99, active: true, expiresAt: "2026-12-31T23:59:59Z", usageLimit: 200, usedCount: 200 },
  { code: "SUMMER20", type: "PERCENT", value: 20, active: true, expiresAt: "2026-08-31T23:59:59Z", usedCount: 342 },
  { code: "VIP25", type: "PERCENT", value: 25, active: false, usedCount: 12 },
];
