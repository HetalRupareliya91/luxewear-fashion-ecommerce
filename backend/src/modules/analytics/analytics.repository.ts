import { prisma } from "../../config/prisma.js";
import type { AnalyticsRepository } from "./analytics.service.js";

const SALES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

/** Prisma implementation of AnalyticsRepository. */
export const prismaAnalyticsRepository: AnalyticsRepository = {
  async ordersSince(since) {
    return prisma.order.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, total: true, status: true } });
  },

  async itemsSince(since) {
    return prisma.orderItem.findMany({
      where: { order: { createdAt: { gte: since }, status: { in: SALES } } },
      select: { productId: true, name: true, quantity: true, unitPrice: true },
    });
  },

  async counts() {
    const [customers, products, pendingOrders] = await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);
    return { customers, products, pendingOrders };
  },
};
