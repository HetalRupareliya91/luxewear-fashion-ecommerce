import { AppError } from "../../src/errors/AppError.js";
import { generateOrderNumber } from "../../src/modules/orders/order.number.js";
import type { CatalogVariant, NewOrder, OrderRecord, OrderRepository } from "../../src/modules/orders/order.types.js";

export const SAMPLE_VARIANTS: CatalogVariant[] = [
  { sku: "LW-001-M", productId: "p1", variantId: "v1", name: "Linen Shirt", size: "M", color: "White", unitPrice: 5900, stock: 10 },
  { sku: "LW-001-L", productId: "p1", variantId: "v2", name: "Linen Shirt", size: "L", color: "White", unitPrice: 5900, stock: 1 },
  { sku: "LW-002-S", productId: "p2", variantId: "v3", name: "Wool Coat", size: "S", color: "Grey", unitPrice: 18900, stock: 3 },
];

/** In-memory OrderRepository that behaves like the database (stock is taken on create, put back on restock). */
export function createMemoryOrders(variants: CatalogVariant[] = SAMPLE_VARIANTS) {
  const stock = new Map(variants.map((v) => [v.sku, { ...v }]));
  const orders: OrderRecord[] = [];
  const perDay = new Map<string, number>();

  const repo: OrderRepository & { orders: OrderRecord[]; stockOf(sku: string): number | undefined } = {
    orders,
    stockOf: (sku) => stock.get(sku)?.stock,
    async findVariants(skus) {
      return skus.flatMap((sku) => (stock.has(sku) ? [{ ...stock.get(sku)! }] : []));
    },
    async create(order: NewOrder, now) {
      for (const line of order.items) {
        if ((stock.get(line.sku)?.stock ?? 0) < line.quantity) throw AppError.conflict("Some items are out of stock", [{ sku: line.sku }]);
      }
      for (const line of order.items) stock.get(line.sku)!.stock -= line.quantity;
      const day = now.toISOString().slice(0, 10);
      const sequence = (perDay.get(day) ?? 0) + 1;
      perDay.set(day, sequence);
      const record: OrderRecord = { ...order, id: `o${orders.length + 1}`, number: generateOrderNumber(now, sequence), status: "PENDING", paymentRef: null, createdAt: now };
      orders.push(record);
      return record;
    },
    async findById(id) {
      return orders.find((o) => o.id === id) ?? null;
    },
    async findByPaymentRef(reference) {
      return orders.find((o) => o.paymentRef === reference) ?? null;
    },
    async list({ userId, status, skip, limit }) {
      const matching = orders.filter((o) => (!userId || o.userId === userId) && (!status || o.status === status)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return { items: matching.slice(skip, skip + limit), total: matching.length };
    },
    async updateStatus(id, status, options) {
      const order = orders.find((o) => o.id === id);
      if (!order) throw AppError.notFound("Order not found");
      order.status = status;
      if (options?.restock) for (const line of order.items) stock.get(line.sku)!.stock += line.quantity;
      return order;
    },
    async setPaymentRef(id, reference) {
      const order = orders.find((o) => o.id === id);
      if (!order) throw AppError.notFound("Order not found");
      order.paymentRef = reference;
      return order;
    },
  };
  return repo;
}
