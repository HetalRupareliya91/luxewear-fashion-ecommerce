import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validateBody.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { parsePagination } from "../../utils/pagination.js";
import { AppError } from "../../errors/AppError.js";
import { validateReview } from "../../validators/reviews.js";
import type { TokenPayload } from "../auth/token.js";
import type { ReviewService } from "./review.service.js";

type Deps = { service: ReviewService; secret: string };

/** /reviews: anyone can read; buyers can write; authors and admins can delete. */
export function createReviewRouter({ service, secret }: Deps) {
  const router = Router();
  const guard = requireAuth(secret);

  router.get("/", async (req, res) => {
    const productId = typeof req.query.productId === "string" ? req.query.productId.trim() : "";
    if (!productId) throw AppError.badRequest("productId is required");
    const page = parsePagination(req.query as Record<string, unknown>, { defaultLimit: 10, maxLimit: 50 });
    const { items, summary, meta } = await service.list(productId, page);
    sendSuccess(res, { reviews: items, summary }, 200, meta);
  });

  router.post("/", guard, validateBody(validateReview), async (req, res) => {
    sendSuccess(res, await service.create((res.locals.user as TokenPayload).sub, req.body), 201);
  });

  router.delete("/:id", guard, async (req, res) => {
    const user = res.locals.user as TokenPayload;
    await service.remove({ id: user.sub, role: user.role }, String(req.params.id));
    sendSuccess(res, { deleted: true });
  });

  return router;
}
