import { AppError } from "../../errors/AppError.js";
import { buildMeta } from "../../utils/pagination.js";
import type { ReviewInput } from "../../validators/reviews.js";
import type { UserRepository } from "../auth/auth.types.js";
import { summarizeRatings } from "./rating.js";
import type { ReviewRepository } from "./review.types.js";

type Deps = { reviews: ReviewRepository; users: Pick<UserRepository, "findById"> };
export type ReviewService = ReturnType<typeof createReviewService>;

export function createReviewService({ reviews, users }: Deps) {
  return {
    async list(productId: string, page: { skip: number; limit: number; page: number }) {
      const [{ items, total }, ratings] = await Promise.all([reviews.listByProduct(productId, page), reviews.ratingsFor(productId)]);
      return { items, summary: summarizeRatings(ratings), meta: buildMeta(page.page, page.limit, total) };
    },

    /** Only people who bought the product can review it, once each. The name shown is "Asha P." */
    async create(userId: string, input: ReviewInput) {
      const user = await users.findById(userId);
      if (!user) throw AppError.unauthorized("Account no longer exists");
      if (!(await reviews.hasPurchased(userId, input.productId))) throw AppError.forbidden("Only customers who bought this product can review it");
      const authorName = user.lastName ? `${user.firstName} ${user.lastName.charAt(0).toUpperCase()}.` : user.firstName;
      return reviews.create({ productId: input.productId, userId, authorName, rating: input.rating, title: input.title ?? null, body: input.body });
    },

    /** The author or an admin can delete a review. */
    async remove(actor: { id: string; role: "CUSTOMER" | "ADMIN" }, reviewId: string) {
      const review = await reviews.findById(reviewId);
      if (!review) throw AppError.notFound("Review not found");
      if (review.userId !== actor.id && actor.role !== "ADMIN") throw AppError.forbidden();
      await reviews.remove(reviewId);
    },
  };
}
