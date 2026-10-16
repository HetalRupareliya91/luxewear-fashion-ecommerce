/** Storage the wishlist service needs. Prisma in production, in memory in tests. */
export type WishlistRepository = {
  /** Product ids, most recently added first. */
  list(userId: string): Promise<string[]>;
  /** Adding something already on the list is not an error. Must throw AppError.notFound for an unknown product. */
  add(userId: string, productId: string): Promise<void>;
  remove(userId: string, productId: string): Promise<void>;
};
