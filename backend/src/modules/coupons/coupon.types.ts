import type { Coupon } from "./coupon.rules.js";

/** Storage the coupon service needs. Prisma in production, in memory in tests. */
export type CouponRepository = {
  findByCode(code: string): Promise<Coupon | null>;
  list(): Promise<Coupon[]>;
  /** Must throw AppError.conflict when the code already exists. */
  create(coupon: Coupon): Promise<Coupon>;
  /** Replaces the editable fields. The usage counter is left alone. Returns null when the code is unknown. */
  update(code: string, coupon: Coupon): Promise<Coupon | null>;
  remove(code: string): Promise<boolean>;
};

export type CouponCheck =
  | { valid: true; code: string; type: Coupon["type"]; discount: number }
  | { valid: false; reason: string };
