import type { WishlistRepository } from "./wishlist.types.js";

export const MAX_WISHLIST = 200;
export type WishlistService = ReturnType<typeof createWishlistService>;

export function createWishlistService({ wishlist }: { wishlist: WishlistRepository }) {
  return {
    list: (userId: string) => wishlist.list(userId),

    async add(userId: string, productId: string) {
      await wishlist.add(userId, productId);
      return wishlist.list(userId);
    },

    async remove(userId: string, productId: string) {
      await wishlist.remove(userId, productId);
      return wishlist.list(userId);
    },

    /**
     * Used right after sign-in: the items saved in the browser are added to the account.
     * Unknown product ids are skipped, not fatal, because the browser may hold stale ids.
     */
    async merge(userId: string, productIds: string[]) {
      const current = new Set(await wishlist.list(userId));
      for (const id of [...new Set(productIds)]) {
        if (current.size >= MAX_WISHLIST) break;
        if (current.has(id)) continue;
        try {
          await wishlist.add(userId, id);
          current.add(id);
        } catch (error) {
          if ((error as { statusCode?: number }).statusCode !== 404) throw error;
        }
      }
      return wishlist.list(userId);
    },
  };
}
