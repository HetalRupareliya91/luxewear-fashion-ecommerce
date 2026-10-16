import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validateBody.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { asBody } from "../../validators/helpers.js";
import { isNonEmpty, type ValidationResult } from "../../validators/primitives.js";
import type { TokenPayload } from "../auth/token.js";
import { MAX_WISHLIST, type WishlistService } from "./wishlist.service.js";

const validateMerge = (input: unknown): ValidationResult<{ productIds: string[] }> => {
  const ids = asBody(input).productIds;
  if (!Array.isArray(ids) || ids.length > MAX_WISHLIST || !ids.every((id) => isNonEmpty(id, 64))) {
    return { ok: false, errors: { productIds: `Send a list of up to ${MAX_WISHLIST} product ids` } };
  }
  return { ok: true, value: { productIds: ids.map((id: string) => id.trim()) } };
};

/** /wishlist: the signed-in customer's saved products. */
export function createWishlistRouter({ service, secret }: { service: WishlistService; secret: string }) {
  const router = Router();
  router.use(requireAuth(secret));
  const me = (locals: Record<string, unknown>) => (locals.user as TokenPayload).sub;

  router.get("/", async (_req, res) => {
    sendSuccess(res, { productIds: await service.list(me(res.locals)) });
  });

  router.post("/merge", validateBody(validateMerge), async (req, res) => {
    sendSuccess(res, { productIds: await service.merge(me(res.locals), req.body.productIds) });
  });

  router.put("/:productId", async (req, res) => {
    sendSuccess(res, { productIds: await service.add(me(res.locals), String(req.params.productId)) });
  });

  router.delete("/:productId", async (req, res) => {
    sendSuccess(res, { productIds: await service.remove(me(res.locals), String(req.params.productId)) });
  });

  return router;
}
