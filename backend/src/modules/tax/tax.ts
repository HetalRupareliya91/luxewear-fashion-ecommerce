import { percentOf, type Cents } from "../../utils/money.js";

export const DEFAULT_TAX_RATE_PERCENT = 8;

/** Tax on an amount, rounded to the nearest cent. Never negative. */
export function calculateTax(taxable: Cents, ratePercent: number = DEFAULT_TAX_RATE_PERCENT): Cents {
  if (taxable <= 0 || ratePercent <= 0) return 0;
  return percentOf(taxable, ratePercent);
}

/** Splits a tax-inclusive price into net and tax parts. */
export function splitInclusive(gross: Cents, ratePercent: number): { net: Cents; tax: Cents } {
  const net = Math.round(gross / (1 + ratePercent / 100));
  return { net, tax: gross - net };
}
