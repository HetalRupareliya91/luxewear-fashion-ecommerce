import { Router, type RequestHandler } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validateBody.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { validateCoupon, validateCouponCheck } from "../../validators/coupons.js";
import type { CouponService } from "./coupon.service.js";

type Deps = { service: CouponService; secret: string; limiter?: RequestHandler };

/** /coupons: shoppers check a code; admins manage them. */
export function createCouponRouter({ service, secret, limiter }: Deps) {
  const router = Router();
  const limit: RequestHandler = limiter ?? ((_req, _res, next) => next());
  const admin = [requireAuth(secret), requireRole("ADMIN")];

  // Public, but limited: otherwise anyone could guess codes quickly.
  router.post("/validate", limit, validateBody(validateCouponCheck), async (req, res) => {
    sendSuccess(res, await service.check(req.body.code, req.body.subtotal));
  });

  router.get("/", ...admin, async (_req, res) => {
    sendSuccess(res, await service.list());
  });

  router.post("/", ...admin, validateBody(validateCoupon), async (req, res) => {
    sendSuccess(res, await service.create(req.body), 201);
  });

  router.patch("/:code", ...admin, async (req, res) => {
    sendSuccess(res, await service.update(String(req.params.code), (req.body ?? {}) as Record<string, unknown>));
  });

  router.delete("/:code", ...admin, async (req, res) => {
    await service.remove(String(req.params.code));
    sendSuccess(res, { deleted: true });
  });

  return router;
}
