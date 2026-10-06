export type RatingSummary = { count: number; average: number; distribution: Record<1 | 2 | 3 | 4 | 5, number> };

/** Ignores anything that is not a whole number from 1 to 5. Average is rounded to one decimal. */
export function summarizeRatings(ratings: number[]): RatingSummary {
  const distribution: RatingSummary["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  let count = 0;
  for (const r of ratings) {
    if (Number.isInteger(r) && r >= 1 && r <= 5) {
      distribution[r as 1 | 2 | 3 | 4 | 5] += 1;
      sum += r;
      count += 1;
    }
  }
  return { count, average: count ? Math.round((sum / count) * 10) / 10 : 0, distribution };
}
