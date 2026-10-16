import { env } from "../../config/env.js";
import { createRateLimiter } from "../../middleware/rateLimit.js";
import { prismaCouponRepository } from "./coupon.repository.js";
import { createCouponRouter } from "./coupon.router.js";
import { createCouponService } from "./coupon.service.js";

export const couponService = createCouponService({ coupons: prismaCouponRepository });

export default createCouponRouter({
  service: couponService,
  secret: env.jwtSecret,
  limiter: createRateLimiter({ windowMs: 60_000, max: 30, message: "Too many coupon checks, please try again in a minute." }),
});
