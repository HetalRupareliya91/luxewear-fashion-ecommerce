/** All money in the API is handled as integer cents to avoid floating point drift. */
export type Cents = number;

export function toCents(amount: number | string): Cents {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) throw new RangeError(`Invalid amount: ${amount}`);
  return Math.round((n + Number.EPSILON) * 100);
}

export const fromCents = (cents: Cents): number => cents / 100;

export function formatMoney(cents: Cents, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(fromCents(cents));
}

/** percent of an amount, rounded to the nearest cent (e.g. percentOf(1999, 10) === 200). */
export const percentOf = (cents: Cents, percent: number): Cents => Math.round((cents * percent) / 100);
