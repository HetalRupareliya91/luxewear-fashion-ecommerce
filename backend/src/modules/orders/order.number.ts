/** LW-20261006-00042: prefix, UTC date, zero padded daily sequence. */
export function generateOrderNumber(date: Date, sequence: number): string {
  if (!Number.isInteger(sequence) || sequence < 1) throw new RangeError("sequence must be a positive integer");
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  return `LW-${ymd}-${String(sequence).padStart(5, "0")}`;
}

export function parseOrderNumber(value: string): { date: string; sequence: number } | null {
  const m = /^LW-(\d{4})(\d{2})(\d{2})-(\d{5,})$/.exec(value);
  return m ? { date: `${m[1]}-${m[2]}-${m[3]}`, sequence: Number(m[4]) } : null;
}
