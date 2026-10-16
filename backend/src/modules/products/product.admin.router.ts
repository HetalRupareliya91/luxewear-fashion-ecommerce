import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validateBody.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { parsePagination } from "../../utils/pagination.js";
import { PRODUCT_STATUSES, validateProduct, validateProductPatch, validateStockChange, type ProductStatus } from "../../validators/products.js";
import type { ProductAdminService } from "./product.admin.js";

/** /admin/products: manage the catalogue. Admin only. */
export function createProductAdminRouter({ service, secret }: { service: ProductAdminService; secret: string }) {
  const router = Router();
  router.use(requireAuth(secret), requireRole("ADMIN"));

  router.get("/", async (req, res) => {
    const page = parsePagination(req.query as Record<string, unknown>, { defaultLimit: 20, maxLimit: 100 });
    const status = PRODUCT_STATUSES.find((s) => s === String(req.query.status ?? "").toUpperCase()) as ProductStatus | undefined;
    const search = typeof req.query.q === "string" ? req.query.q : undefined;
    const { items, meta } = await service.list({ ...page, status, search });
    sendSuccess(res, items, 200, meta);
  });

  router.post("/", validateBody(validateProduct), async (req, res) => {
    sendSuccess(res, await service.create(req.body), 201);
  });

  // Declared before "/:id" so "variants" is not read as a product id.
  router.patch("/variants/:sku/stock", validateBody(validateStockChange), async (req, res) => {
    sendSuccess(res, await service.setStock(String(req.params.sku), req.body.stock));
  });

  router.get("/:id", async (req, res) => {
    sendSuccess(res, await service.get(String(req.params.id)));
  });

  router.patch("/:id", validateBody(validateProductPatch), async (req, res) => {
    sendSuccess(res, await service.update(String(req.params.id), req.body));
  });

  router.delete("/:id", async (req, res) => {
    sendSuccess(res, await service.archive(String(req.params.id)));
  });

  return router;
}
