import { AppError } from "../../errors/AppError.js";

export type StockLevel = { sku: string; onHand: number; reserved: number };
export type StockRequest = { sku: string; quantity: number };

export const available = (level: StockLevel): number => Math.max(level.onHand - level.reserved, 0);

const totalsBySku = (requests: StockRequest[]) => {
  const totals = new Map<string, number>();
  for (const r of requests) totals.set(r.sku, (totals.get(r.sku) ?? 0) + r.quantity);
  return totals;
};

/** Lists every SKU that cannot be fulfilled. Lines for the same SKU are added together; an unknown SKU has 0 available. */
export function findShortages(levels: StockLevel[], requests: StockRequest[]) {
  const bySku = new Map(levels.map((l) => [l.sku, l]));
  return [...totalsBySku(requests)]
    .map(([sku, requested]) => ({ sku, requested, available: bySku.has(sku) ? available(bySku.get(sku)!) : 0 }))
    .filter((s) => s.requested > s.available);
}

/** All-or-nothing reservation: returns new levels, or throws 409 naming the short SKUs. */
export function reserveStock(levels: StockLevel[], requests: StockRequest[]): StockLevel[] {
  const shortages = findShortages(levels, requests);
  if (shortages.length) throw AppError.conflict("Some items are out of stock", shortages);
  const wanted = totalsBySku(requests);
  return levels.map((l) => ({ ...l, reserved: l.reserved + (wanted.get(l.sku) ?? 0) }));
}

export function releaseStock(levels: StockLevel[], requests: StockRequest[]): StockLevel[] {
  const released = totalsBySku(requests);
  return levels.map((l) => ({ ...l, reserved: Math.max(l.reserved - (released.get(l.sku) ?? 0), 0) }));
}
