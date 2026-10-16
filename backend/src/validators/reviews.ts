import { asBody, isIntBetween, isMissing } from "./helpers.js";
import { isNonEmpty, type ValidationResult } from "./primitives.js";

export type ReviewInput = { productId: string; rating: number; title?: string; body: string };

export function validateReview(input: unknown): ValidationResult<ReviewInput> {
  const b = asBody(input);
  const errors: Record<string, string> = {};
  if (!isNonEmpty(b.productId, 64)) errors.productId = "productId is required";
  if (!isIntBetween(b.rating, 1, 5)) errors.rating = "Rating must be a whole number from 1 to 5";
  if (!isNonEmpty(b.body, 2000) || (b.body as string).trim().length < 10) errors.body = "Write at least 10 characters (2000 at most)";
  if (!isMissing(b.title) && !isNonEmpty(b.title, 100)) errors.title = "Title must be 100 characters or fewer";
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      productId: (b.productId as string).trim(),
      rating: b.rating as number,
      body: (b.body as string).trim(),
      ...(isMissing(b.title) ? {} : { title: (b.title as string).trim() }),
    },
  };
}
