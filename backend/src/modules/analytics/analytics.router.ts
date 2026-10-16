import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { clampDays, type AnalyticsService } from "./analytics.service.js";

/** GET /admin/summary?days=30. Admin only. */
export function createAnalyticsRouter({ service, secret }: { service: AnalyticsService; secret: string }) {
  const router = Router();
  router.use(requireAuth(secret), requireRole("ADMIN"));
  router.get("/summary", async (req, res) => {
    sendSuccess(res, await service.summary(clampDays(req.query.days)));
  });
  return router;
}
