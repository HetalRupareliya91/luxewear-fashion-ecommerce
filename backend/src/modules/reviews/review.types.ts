export type ReviewRecord = {
  id: string;
  productId: string;
  userId: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: Date;
};

export type NewReview = Omit<ReviewRecord, "id" | "createdAt">;

/** Storage the review service needs. Prisma in production, in memory in tests. */
export type ReviewRepository = {
  /** Newest first. */
  listByProduct(productId: string, page: { skip: number; limit: number }): Promise<{ items: ReviewRecord[]; total: number }>;
  ratingsFor(productId: string): Promise<number[]>;
  /** Must throw AppError.conflict when this user already reviewed the product. */
  create(review: NewReview): Promise<ReviewRecord>;
  findById(id: string): Promise<ReviewRecord | null>;
  remove(id: string): Promise<void>;
  /** True when the user has a paid (or later) order containing the product. */
  hasPurchased(userId: string, productId: string): Promise<boolean>;
};
