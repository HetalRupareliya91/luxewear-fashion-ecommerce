import { env } from "../../config/env.js";
import { prismaOrderRepository } from "../orders/order.repository.js";
import { mockProvider } from "./payment.provider.js";
import { createPaymentRouter } from "./payment.router.js";
import { createPaymentService } from "./payment.service.js";

// Swap mockProvider for a real provider here when going live.
const service = createPaymentService({ orders: prismaOrderRepository, provider: mockProvider });

export default createPaymentRouter({ service, secret: env.jwtSecret, webhookSecret: env.paymentWebhookSecret });
