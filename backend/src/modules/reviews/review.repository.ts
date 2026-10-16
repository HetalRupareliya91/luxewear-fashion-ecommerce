import { prisma } from "../../config/prisma.js";
import { AppError } from "../../errors/AppError.js";
import type { ReviewRepository } from "./review.types.js";

const PAID_OR_LATER = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

/** Prisma implementation of ReviewRepository. */
export const prismaReviewRepository: ReviewRepository = {
  async listByProduct(productId, { skip, limit }) {
    const [items, total] = await Promise.all([
      prisma.review.findMany({ where: { productId }, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.review.count({ where: { productId } }),
    ]);
    return { items, total };
  },

  async ratingsFor(productId) {
    const rows: { rating: number }[] = await prisma.review.findMany({ where: { productId }, select: { rating: true } });
    return rows.map((r) => r.rating);
  },

  async create(review) {
    try {
      return await prisma.review.create({ data: review });
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") throw AppError.conflict("You already reviewed this product");
      throw error;
    }
  },

  async findById(id) {
    return prisma.review.findUnique({ where: { id } });
  },

  async remove(id) {
    await prisma.review.deleteMany({ where: { id } });
  },

  async hasPurchased(userId, productId) {
    const found = await prisma.order.findFirst({ where: { userId, status: { in: PAID_OR_LATER }, items: { some: { productId } } }, select: { id: true } });
    return found !== null;
  },
};
