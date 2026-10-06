export type Pagination = { page: number; limit: number; skip: number };

/** Reads ?page and ?limit safely: page >= 1 and 1 <= limit <= maxLimit. */
export function parsePagination(
  query: Record<string, unknown> = {},
  { defaultLimit = 20, maxLimit = 100 }: { defaultLimit?: number; maxLimit?: number } = {},
): Pagination {
  const limit = Math.min(Math.max(Number.parseInt(String(query.limit ?? ""), 10) || defaultLimit, 1), maxLimit);
  const page = Math.max(Number.parseInt(String(query.page ?? ""), 10) || 1, 1);
  return { page, limit, skip: (page - 1) * limit };
}

export function buildMeta(page: number, limit: number, total: number) {
  return { page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) };
}
