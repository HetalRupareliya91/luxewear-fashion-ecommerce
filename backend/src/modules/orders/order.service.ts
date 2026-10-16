import { AppError } from "../../errors/AppError.js";
import { buildMeta } from "../../utils/pagination.js";
import type { CheckoutInput, QuoteInput } from "../../validators/orders.js";
import { calculateCartTotals } from "../cart/cart.totals.js";
import type { CouponRepository } from "../coupons/coupon.types.js";
import { findShortages } from "../inventory/stock.js";
import { amountToFreeShipping } from "../shipping/shipping.js";
import { assertTransition, type OrderStatus } from "./order.status.js";
import type { OrderLine, OrderRecord, OrderRepository } from "./order.types.js";

type Deps = { orders: OrderRepository; coupons: Pick<CouponRepository, "findByCode">; now?: () => Date };

export type OrderService = ReturnType<typeof createOrderService>;
type Page = { skip: number; limit: number; page: number };

export function createOrderService({ orders, coupons, now = () => new Date() }: Deps) {
  /** Looks everything up on the server: the client only says which SKUs and how many, never prices. */
  async function price(input: QuoteInput) {
    const skus = input.items.map((i) => i.sku);
    const variants = new Map((await orders.findVariants(skus)).map((v) => [v.sku, v]));

    const missing = skus.filter((sku) => !variants.has(sku));
    if (missing.length) throw AppError.notFound(`Unknown item: ${missing.join(", ")}`);

    const shortages = findShortages(
      [...variants.values()].map((v) => ({ sku: v.sku, onHand: v.stock, reserved: 0 })),
      input.items,
    );
    if (shortages.length) throw AppError.conflict("Some items are out of stock", shortages);

    const lines: OrderLine[] = input.items.map(({ sku, quantity }) => {
      const v = variants.get(sku)!;
      return { sku, productId: v.productId, variantId: v.variantId, name: v.name, size: v.size, color: v.color, unitPrice: v.unitPrice, quantity };
    });

    const coupon = input.couponCode ? await coupons.findByCode(input.couponCode) : null;
    const couponError = input.couponCode && !coupon ? "Coupon code not found" : undefined;
    const totals = calculateCartTotals({ lines, coupon: coupon ?? undefined, shippingMethod: input.shippingMethod, now: now() });
    return { lines, totals, couponCode: coupon ? coupon.code : undefined, couponError: couponError ?? totals.couponError };
  }

  async function ownOrder(userId: string, id: string): Promise<OrderRecord> {
    const order = await orders.findById(id);
    // 404 (not 403) so nobody can probe which order ids exist
    if (!order || order.userId !== userId) throw AppError.notFound("Order not found");
    return order;
  }

  return {
    /** What the cart would cost. A bad coupon is reported next to the totals instead of failing the request. */
    async quote(input: QuoteInput) {
      const { lines, totals, couponError } = await price(input);
      const { couponError: _dropped, ...amounts } = totals;
      return {
        items: lines.map((l) => ({ sku: l.sku, name: l.name, size: l.size, color: l.color, unitPrice: l.unitPrice, quantity: l.quantity })),
        ...amounts,
        amountToFreeShipping: amountToFreeShipping(totals.subtotal - totals.discount),
        ...(couponError ? { couponError } : {}),
      };
    },

    async place(user: { id: string; email: string }, input: CheckoutInput): Promise<OrderRecord> {
      const { lines, totals, couponCode, couponError } = await price(input);
      if (couponError) throw AppError.badRequest(couponError);
      return orders.create(
        {
          userId: user.id,
          email: user.email,
          items: lines,
          subtotal: totals.subtotal,
          discount: totals.discount,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total,
          couponCode: couponCode ?? null,
          shippingMethod: input.shippingMethod,
          shippingAddress: input.shippingAddress,
        },
        now(),
      );
    },

    async listMine(userId: string, { skip, limit, page }: Page) {
      const { items, total } = await orders.list({ userId, skip, limit });
      return { items, meta: buildMeta(page, limit, total) };
    },

    getMine: ownOrder,

    /** Customers can cancel only before payment; after that, support has to handle it. */
    async cancelMine(userId: string, id: string) {
      const order = await ownOrder(userId, id);
      if (order.status !== "PENDING") throw AppError.conflict("Only unpaid orders can be cancelled here. Please contact support.");
      return orders.updateStatus(id, assertTransition(order.status, "CANCELLED"), { restock: true });
    },

    async listAll(filter: { status?: OrderStatus } & Page) {
      const { items, total } = await orders.list({ status: filter.status, skip: filter.skip, limit: filter.limit });
      return { items, meta: buildMeta(filter.page, filter.limit, total) };
    },

    async get(id: string) {
      const order = await orders.findById(id);
      if (!order) throw AppError.notFound("Order not found");
      return order;
    },

    /** Admin status change. Only the allowed moves work, and cancelling puts the stock back. */
    async updateStatus(id: string, to: OrderStatus) {
      const order = await orders.findById(id);
      if (!order) throw AppError.notFound("Order not found");
      assertTransition(order.status, to);
      return orders.updateStatus(id, to, { restock: to === "CANCELLED" });
    },
  };
}
