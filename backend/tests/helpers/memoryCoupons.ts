import { AppError } from "../../src/errors/AppError.js";
import type { Coupon } from "../../src/modules/coupons/coupon.rules.js";
import type { CouponRepository } from "../../src/modules/coupons/coupon.types.js";

/** In-memory CouponRepository with the same unique-code behaviour as the database. */
export function createMemoryCoupons(seed: Coupon[] = []): CouponRepository & { all(): Coupon[] } {
  const store = new Map<string, Coupon>(seed.map((c) => [c.code, { usedCount: 0, ...c }]));
  return {
    async findByCode(code) {
      return store.get(code) ?? null;
    },
    async list() {
      return [...store.values()].sort((a, b) => a.code.localeCompare(b.code));
    },
    async create(coupon) {
      if (store.has(coupon.code)) throw AppError.conflict("A coupon with this code already exists");
      const saved = { ...coupon, usedCount: 0 };
      store.set(coupon.code, saved);
      return saved;
    },
    async update(code, coupon) {
      const current = store.get(code);
      if (!current) return null;
      const saved = { ...coupon, usedCount: current.usedCount ?? 0 };
      store.set(code, saved);
      return saved;
    },
    async remove(code) {
      return store.delete(code);
    },
    all: () => [...store.values()],
  };
}
