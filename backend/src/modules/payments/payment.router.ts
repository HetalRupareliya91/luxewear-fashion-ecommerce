import { Router } from "express";
import { AppError } from "../../errors/AppError.js";
import { requireAuth } from "../../middleware/auth.js";
import type { WithRawBody } from "../../middleware/rawBody.js";
import { validateBody } from "../../middleware/validateBody.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { asBody } from "../../validators/helpers.js";
import { isNonEmpty, type ValidationResult } from "../../validators/primitives.js";
import type { TokenPayload } from "../auth/token.js";
import type { PaymentService } from "./payment.service.js";
import { verifySignature } from "./signature.js";

type Deps = { service: PaymentService; secret: string; webhookSecret: string };

const validateIntent = (input: unknown): ValidationResult<{ orderId: string }> => {
  const orderId = asBody(input).orderId;
  return isNonEmpty(orderId, 64) ? { ok: true, value: { orderId: orderId.trim() } } : { ok: false, errors: { orderId: "orderId is required" } };
};

/** /payments: customers start a payment; the payment company confirms it with a signed webhook. */
export function createPaymentRouter({ service, secret, webhookSecret }: Deps) {
  const router = Router();

  router.post("/intent", requireAuth(secret), validateBody(validateIntent), async (req, res) => {
    sendSuccess(res, await service.createIntent((res.locals.user as TokenPayload).sub, req.body.orderId), 201);
  });

  // No login here: the HMAC signature over the raw body proves the request came from the payment company.
  router.post("/webhook", async (req, res) => {
    const raw = (req as unknown as WithRawBody).rawBody;
    if (!raw || !verifySignature(raw, req.header("x-signature") ?? undefined, webhookSecret)) throw AppError.unauthorized("Invalid signature");
    const event = asBody(req.body);
    if (typeof event.type !== "string" || typeof event.reference !== "string") throw AppError.badRequest("type and reference are required");
    sendSuccess(res, await service.handleEvent({ type: event.type, reference: event.reference }));
  });

  return router;
}
