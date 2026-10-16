import { prisma } from "../../config/prisma.js";
import { AppError } from "../../errors/AppError.js";
import type { WishlistRepository } from "./wishlist.types.js";

/** Prisma implementation of WishlistRepository. */
export const prismaWishlistRepository: WishlistRepository = {
  async list(userId) {
    const rows: { productId: string }[] = await prisma.wishlistItem.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { productId: true } });
    return rows.map((r) => r.productId);
  },

  async add(userId, productId) {
    try {
      await prisma.wishlistItem.upsert({ where: { userId_productId: { userId, productId } }, update: {}, create: { userId, productId } });
    } catch (error) {
      // P2003 = foreign key failed, so the product does not exist
      if ((error as { code?: string }).code === "P2003") throw AppError.notFound("Product not found");
      throw error;
    }
  },

  async remove(userId, productId) {
    await prisma.wishlistItem.deleteMany({ where: { userId, productId } });
  },
};
