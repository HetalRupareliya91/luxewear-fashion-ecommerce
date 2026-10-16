import { prisma } from "../../config/prisma.js";
import { AppError } from "../../errors/AppError.js";
import { toCents } from "../../utils/money.js";
import { generateOrderNumber } from "./order.number.js";
import type { CatalogVariant, OrderLine, OrderRecord, OrderRepository } from "./order.types.js";

type ItemRow = { sku: string; productId: string; variantId: string | null; name: string; size: string | null; color: string | null; unitPrice: number; quantity: number };

const toLine = (row: ItemRow): OrderLine => ({
  sku: row.sku,
  productId: row.productId,
  variantId: row.variantId ?? "",
  name: row.name,
  size: row.size,
  color: row.color,
  unitPrice: row.unitPrice,
  quantity: row.quantity,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toRecord = (row: any): OrderRecord => ({
  id: row.id,
  number: row.number,
  userId: row.userId,
  email: row.email,
  status: row.status,
  items: (row.items as ItemRow[]).map(toLine),
  subtotal: row.subtotal,
  discount: row.discount,
  shipping: row.shipping,
  tax: row.tax,
  total: row.total,
  couponCode: row.couponCode,
  shippingMethod: row.shippingMethod,
  shippingAddress: row.shippingAddress,
  paymentRef: row.paymentRef,
  createdAt: row.createdAt,
});

const include = { items: true };

/** Prisma implementation of OrderRepository. */
export const prismaOrderRepository: OrderRepository = {
  async findVariants(skus): Promise<CatalogVariant[]> {
    const rows = await prisma.productVariant.findMany({ where: { sku: { in: skus }, product: { status: "ACTIVE" } }, include: { product: true } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((r: any) => ({
      sku: r.sku,
      productId: r.productId,
      variantId: r.id,
      name: r.product.name,
      size: r.size,
      color: r.color,
      unitPrice: toCents(String(r.price ?? r.product.price)),
      stock: r.stock,
    }));
  },

  async create(order, now) {
    const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    for (let attempt = 0; ; attempt++) {
      try {
        // One transaction: take stock, count the coupon, store the order. Either all of it happens or none of it.
        return await prisma.$transaction(async (tx: typeof prisma) => {
          for (const line of order.items) {
            // The `stock >= quantity` condition makes the check and the decrement a single atomic step.
            const taken = await tx.productVariant.updateMany({ where: { id: line.variantId, stock: { gte: line.quantity } }, data: { stock: { decrement: line.quantity } } });
            if (taken.count !== 1) throw AppError.conflict("Some items are out of stock", [{ sku: line.sku }]);
          }
          if (order.couponCode) await tx.coupon.update({ where: { code: order.couponCode }, data: { usedCount: { increment: 1 } } });
          const sequence = (await tx.order.count({ where: { createdAt: { gte: dayStart } } })) + 1;
          const row = await tx.order.create({
            data: {
              number: generateOrderNumber(now, sequence),
              userId: order.userId,
              email: order.email,
              subtotal: order.subtotal,
              discount: order.discount,
              shipping: order.shipping,
              tax: order.tax,
              total: order.total,
              couponCode: order.couponCode,
              shippingMethod: order.shippingMethod,
              shippingAddress: order.shippingAddress,
              items: { create: order.items.map(({ sku, productId, variantId, name, size, color, unitPrice, quantity }) => ({ sku, productId, variantId, name, size, color, unitPrice, quantity })) },
            },
            include,
          });
          return toRecord(row);
        });
      } catch (error) {
        // P2002 = two orders got the same daily number at once; try again with a fresh count
        if ((error as { code?: string }).code === "P2002" && attempt < 3) continue;
        throw error;
      }
    }
  },

  async findById(id) {
    const row = await prisma.order.findUnique({ where: { id }, include });
    return row ? toRecord(row) : null;
  },

  async findByPaymentRef(reference) {
    const row = await prisma.order.findFirst({ where: { paymentRef: reference }, include });
    return row ? toRecord(row) : null;
  },

  async list({ userId, status, skip, limit }) {
    const where = { ...(userId ? { userId } : {}), ...(status ? { status } : {}) };
    const [rows, total] = await Promise.all([prisma.order.findMany({ where, include, orderBy: { createdAt: "desc" }, skip, take: limit }), prisma.order.count({ where })]);
    return { items: rows.map(toRecord), total };
  },

  async updateStatus(id, status, options) {
    return prisma.$transaction(async (tx: typeof prisma) => {
      const row = await tx.order.update({ where: { id }, data: { status }, include });
      if (options?.restock) {
        for (const line of row.items as ItemRow[]) {
          if (line.variantId) await tx.productVariant.update({ where: { id: line.variantId }, data: { stock: { increment: line.quantity } } });
        }
      }
      return toRecord(row);
    });
  },

  async setPaymentRef(id, reference) {
    return toRecord(await prisma.order.update({ where: { id }, data: { paymentRef: reference }, include }));
  },
};
