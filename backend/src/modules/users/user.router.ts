import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validateBody.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { parsePagination } from "../../utils/pagination.js";
import { asBody } from "../../validators/helpers.js";
import type { ValidationResult } from "../../validators/primitives.js";
import type { UserRole } from "../auth/auth.types.js";
import type { TokenPayload } from "../auth/token.js";
import type { UserAdminService } from "./user.admin.js";

const validateRole = (input: unknown): ValidationResult<{ role: UserRole }> => {
  const role = asBody(input).role;
  return role === "CUSTOMER" || role === "ADMIN" ? { ok: true, value: { role } } : { ok: false, errors: { role: "Role must be CUSTOMER or ADMIN" } };
};

/** /admin/users: list customers and change roles. Admin only. */
export function createUserAdminRouter({ service, secret }: { service: UserAdminService; secret: string }) {
  const router = Router();
  router.use(requireAuth(secret), requireRole("ADMIN"));

  router.get("/", async (req, res) => {
    const page = parsePagination(req.query as Record<string, unknown>, { defaultLimit: 20, maxLimit: 100 });
    const search = typeof req.query.q === "string" ? req.query.q : undefined;
    const { items, meta } = await service.list({ ...page, search });
    sendSuccess(res, items, 200, meta);
  });

  router.patch("/:id/role", validateBody(validateRole), async (req, res) => {
    sendSuccess(res, await service.setRole((res.locals.user as TokenPayload).sub, String(req.params.id), req.body.role));
  });

  return router;
}
