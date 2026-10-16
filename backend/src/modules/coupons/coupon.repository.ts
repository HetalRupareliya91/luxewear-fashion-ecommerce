import { prisma } from "../../config/prisma.js";
import { AppError } from "../../errors/AppError.js";
import type { Coupon } from "./coupon.rules.js";
import type { CouponRepository } from "./coupon.types.js";

type CouponRow = {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  active: boolean;
  minSubtotal: number | null;
  maxDiscount: number | null;
  startsAt: Date | null;
  expiresAt: Date | null;
  usageLimit: number | null;
  usedCount: number;
};

/** Database rows use null for "not set"; the rules use undefined. */
const toCoupon = (row: CouponRow): Coupon => ({
  code: row.code,
  type: row.type,
  value: row.value,
  active: row.active,
  usedCount: row.usedCount,
  ...(row.minSubtotal !== null ? { minSubtotal: row.minSubtotal } : {}),
  ...(row.maxDiscount !== null ? { maxDiscount: row.maxDiscount } : {}),
  ...(row.startsAt ? { startsAt: row.startsAt } : {}),
  ...(row.expiresAt ? { expiresAt: row.expiresAt } : {}),
  ...(row.usageLimit !== null ? { usageLimit: row.usageLimit } : {}),
});

const toData = (c: Coupon) => ({
  type: c.type,
  value: c.value,
  active: c.active,
  minSubtotal: c.minSubtotal ?? null,
  maxDiscount: c.maxDiscount ?? null,
  startsAt: c.startsAt ?? null,
  expiresAt: c.expiresAt ?? null,
  usageLimit: c.usageLimit ?? null,
});

export const prismaCouponRepository: CouponRepository = {
  async findByCode(code) {
    const row = await prisma.coupon.findUnique({ where: { code } });
    return row ? toCoupon(row) : null;
  },

  async list() {
    const rows: CouponRow[] = await prisma.coupon.findMany({ orderBy: { code: "asc" } });
    return rows.map(toCoupon);
  },

  async create(coupon) {
    try {
      return toCoupon(await prisma.coupon.create({ data: { code: coupon.code, ...toData(coupon) } }));
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") throw AppError.conflict("A coupon with this code already exists");
      throw error;
    }
  },

  async update(code, coupon) {
    try {
      return toCoupon(await prisma.coupon.update({ where: { code }, data: toData(coupon) }));
    } catch (error) {
      if ((error as { code?: string }).code === "P2025") return null; // record not found
      throw error;
    }
  },

  async remove(code) {
    const result = await prisma.coupon.deleteMany({ where: { code } });
    return result.count > 0;
  },
};
