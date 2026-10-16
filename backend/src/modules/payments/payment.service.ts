import { AppError } from "../../errors/AppError.js";
import type { OrderRepository } from "../orders/order.types.js";
import { assertTransition } from "../orders/order.status.js";
import type { PaymentProvider } from "./payment.provider.js";

type Deps = { orders: OrderRepository; provider: PaymentProvider; currency?: string };

export type PaymentEvent = { type: string; reference: string };
export type PaymentService = ReturnType<typeof createPaymentService>;

export function createPaymentService({ orders, provider, currency = "USD" }: Deps) {
  return {
    /** Starts a payment for one of the customer's unpaid orders. */
    async createIntent(userId: string, orderId: string) {
      const order = await orders.findById(orderId);
      if (!order || order.userId !== userId) throw AppError.notFound("Order not found");
      if (order.status !== "PENDING") throw AppError.conflict(`This order is ${order.status.toLowerCase()} and cannot be paid`);

      const intent = await provider.createIntent({ orderNumber: order.number, amount: order.total, currency });
      await orders.setPaymentRef(order.id, intent.reference);
      return { orderId: order.id, amount: order.total, currency, provider: provider.name, ...intent };
    },

    /**
     * Applies a signed event from the payment company. Safe to receive twice:
     * a success for an order that is already paid changes nothing.
     */
    async handleEvent(event: PaymentEvent): Promise<{ handled: boolean; status?: string }> {
      const order = await orders.findByPaymentRef(event.reference);
      if (!order) return { handled: false };

      if (event.type === "payment.succeeded") {
        if (order.status !== "PENDING") return { handled: true, status: order.status };
        const paid = await orders.updateStatus(order.id, assertTransition(order.status, "PAID"));
        return { handled: true, status: paid.status };
      }
      // Failed payments leave the order PENDING so the customer can try again.
      return { handled: event.type === "payment.failed", status: order.status };
    },
  };
}
