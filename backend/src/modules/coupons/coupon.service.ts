import { AppError } from "../../errors/AppError.js";
import { normalizeCouponCode, validateCoupon } from "../../validators/coupons.js";
import { evaluateCoupon, type Coupon } from "./coupon.rules.js";
import type { CouponCheck, CouponRepository } from "./coupon.types.js";

type Deps = { coupons: CouponRepository; now?: () => Date };

export type CouponService = ReturnType<typeof createCouponService>;

export function createCouponService({ coupons, now = () => new Date() }: Deps) {
  return {
    /** Tells a shopper what a code would save on a cart. Unknown codes are a normal "not valid" answer, not an error. */
    async check(rawCode: string, subtotal: number): Promise<CouponCheck> {
      const coupon = await coupons.findByCode(normalizeCouponCode(rawCode));
      if (!coupon) return { valid: false, reason: "Coupon code not found" };
      const result = evaluateCoupon(coupon, subtotal, now());
      return result.valid ? { valid: true, code: coupon.code, type: coupon.type, discount: result.discount } : { valid: false, reason: result.reason };
    },

    list: () => coupons.list(),

    create: (coupon: Coupon) => coupons.create(coupon),

    /** Merges the changes into the stored coupon and validates the result as a whole. */
    async update(rawCode: string, changes: Record<string, unknown>) {
      const code = normalizeCouponCode(rawCode);
      const existing = await coupons.findByCode(code);
      if (!existing) throw AppError.notFound("Coupon not found");
      const { usedCount: _ignored, ...editable } = existing;
      const merged = validateCoupon({ ...editable, ...changes, code });
      if (!merged.ok) throw AppError.badRequest("Validation failed", merged.errors);
      const saved = await coupons.update(code, merged.value);
      if (!saved) throw AppError.notFound("Coupon not found");
      return saved;
    },

    async remove(rawCode: string) {
      if (!(await coupons.remove(normalizeCouponCode(rawCode)))) throw AppError.notFound("Coupon not found");
    },
  };
}
