import { Router, type RequestHandler } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validateBody.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { parsePagination } from "../../utils/pagination.js";
import { validateCheckout, validateQuote, validateStatusChange, ORDER_STATUSES } from "../../validators/orders.js";
import type { TokenPayload } from "../auth/token.js";
import type { UserRepository } from "../auth/auth.types.js";
import { AppError } from "../../errors/AppError.js";
import type { OrderService } from "./order.service.js";
import type { OrderStatus } from "./order.status.js";

type Deps = { service: OrderService; users: Pick<UserRepository, "findById">; secret: string; limiter?: RequestHandler };

const param = (value: unknown) => String(value);

/** /orders for signed-in customers. */
export function createOrderRouter({ service, users, secret }: Deps) {
  const router = Router();
  router.use(requireAuth(secret));

  router.post("/", validateBody(validateCheckout), async (req, res) => {
    const { sub } = res.locals.user as TokenPayload;
    const user = await users.findById(sub);
    if (!user) throw AppError.unauthorized("Account no longer exists");
    sendSuccess(res, await service.place({ id: user.id, email: user.email }, req.body), 201);
  });

  router.get("/", async (req, res) => {
    const { sub } = res.locals.user as TokenPayload;
    const page = parsePagination(req.query as Record<string, unknown>, { defaultLimit: 10, maxLimit: 50 });
    const { items, meta } = await service.listMine(sub, page);
    sendSuccess(res, items, 200, meta);
  });

  router.get("/:id", async (req, res) => {
    sendSuccess(res, await service.getMine((res.locals.user as TokenPayload).sub, param(req.params.id)));
  });

  router.post("/:id/cancel", async (req, res) => {
    sendSuccess(res, await service.cancelMine((res.locals.user as TokenPayload).sub, param(req.params.id)));
  });

  return router;
}

/** /admin/orders: every order, plus status changes. */
export function createAdminOrderRouter({ service, secret }: Pick<Deps, "service" | "secret">) {
  const router = Router();
  router.use(requireAuth(secret), requireRole("ADMIN"));

  router.get("/", async (req, res) => {
    const page = parsePagination(req.query as Record<string, unknown>, { defaultLimit: 20, maxLimit: 100 });
    const status = ORDER_STATUSES.find((s) => s === String(req.query.status ?? "").toUpperCase()) as OrderStatus | undefined;
    const { items, meta } = await service.listAll({ ...page, status });
    sendSuccess(res, items, 200, meta);
  });

  router.get("/:id", async (req, res) => {
    sendSuccess(res, await service.get(param(req.params.id)));
  });

  router.patch("/:id/status", validateBody(validateStatusChange), async (req, res) => {
    sendSuccess(res, await service.updateStatus(param(req.params.id), req.body.status));
  });

  return router;
}

/** POST /checkout/quote: the cart total before the shopper commits. Public, so it is rate limited. */
export function createCheckoutRouter({ service, limiter }: Pick<Deps, "service" | "limiter">) {
  const router = Router();
  const limit: RequestHandler = limiter ?? ((_req, _res, next) => next());
  router.post("/quote", limit, validateBody(validateQuote), async (req, res) => {
    sendSuccess(res, await service.quote(req.body));
  });
  return router;
}
