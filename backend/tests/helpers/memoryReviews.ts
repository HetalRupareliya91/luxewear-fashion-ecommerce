import { AppError } from "../../src/errors/AppError.js";
import type { ReviewRecord, ReviewRepository } from "../../src/modules/reviews/review.types.js";

/** In-memory ReviewRepository. `buyers` lists "userId:productId" pairs that count as purchases. */
export function createMemoryReviews(buyers: string[] = []) {
  const reviews: ReviewRecord[] = [];
  const repo: ReviewRepository & { reviews: ReviewRecord[] } = {
    reviews,
    async listByProduct(productId, { skip, limit }) {
      const matching = reviews.filter((r) => r.productId === productId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return { items: matching.slice(skip, skip + limit), total: matching.length };
    },
    async ratingsFor(productId) {
      return reviews.filter((r) => r.productId === productId).map((r) => r.rating);
    },
    async create(review) {
      if (reviews.some((r) => r.userId === review.userId && r.productId === review.productId)) throw AppError.conflict("You already reviewed this product");
      const record: ReviewRecord = { ...review, id: `r${reviews.length + 1}`, createdAt: new Date(Date.now() + reviews.length) };
      reviews.push(record);
      return record;
    },
    async findById(id) {
      return reviews.find((r) => r.id === id) ?? null;
    },
    async remove(id) {
      const index = reviews.findIndex((r) => r.id === id);
      if (index >= 0) reviews.splice(index, 1);
    },
    async hasPurchased(userId, productId) {
      return buyers.includes(`${userId}:${productId}`);
    },
  };
  return repo;
}
