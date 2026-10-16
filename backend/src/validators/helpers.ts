export type Body = Record<string, unknown>;

export const asBody = (v: unknown): Body => (v && typeof v === "object" && !Array.isArray(v) ? (v as Body) : {});

/** A whole number of cents between 0 and 1,000,000.00. */
export const isCents = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 100_000_000;

export const isIntBetween = (v: unknown, min: number, max: number): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= min && v <= max;

/** Accepts a Date or an ISO date string. Returns null for anything else. */
export function parseDate(v: unknown): Date | null {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  if (typeof v !== "string" || v.trim() === "") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** null, undefined and "" all mean "not provided". */
export const isMissing = (v: unknown): boolean => v === undefined || v === null || v === "";
