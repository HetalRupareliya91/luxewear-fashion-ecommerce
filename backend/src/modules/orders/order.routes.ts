import { env } from "../../config/env.js";
import { createRateLimiter } from "../../middleware/rateLimit.js";
import { prismaUserRepository } from "../auth/auth.repository.js";
import { prismaCouponRepository } from "../coupons/coupon.repository.js";
import { prismaOrderRepository } from "./order.repository.js";
import { createAdminOrderRouter, createCheckoutRouter, createOrderRouter } from "./order.router.js";
import { createOrderService } from "./order.service.js";

export const orderService = createOrderService({ orders: prismaOrderRepository, coupons: prismaCouponRepository });

export const orderRoutes = createOrderRouter({ service: orderService, users: prismaUserRepository, secret: env.jwtSecret });
export const adminOrderRoutes = createAdminOrderRouter({ service: orderService, secret: env.jwtSecret });
export const checkoutRoutes = createCheckoutRouter({
  service: orderService,
  limiter: createRateLimiter({ windowMs: 60_000, max: 60, message: "Too many price checks, please try again in a minute." }),
});
