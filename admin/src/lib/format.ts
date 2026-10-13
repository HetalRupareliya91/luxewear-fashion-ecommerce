/** $24,580 for whole amounts, $24,580.50 with cents. */
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const formatNumber = (n: number): string => new Intl.NumberFormat("en-US").format(n);

/** "6 Oct 2026" (always UTC so server and browser agree). */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export const formatPercent = (value: number): string => `${Math.round(value)}%`;
