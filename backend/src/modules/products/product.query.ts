import { parsePagination } from "../../utils/pagination.js";

export type ProductSort = "newest" | "price-asc" | "price-desc" | "name";
export type Gender = "MEN" | "WOMEN" | "UNISEX";

export type ProductQuery = {
  category?: string;
  gender?: Gender;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: ProductSort;
  page: number;
  limit: number;
  skip: number;
};

const SORTS: ProductSort[] = ["newest", "price-asc", "price-desc", "name"];
const GENDERS: Record<string, Gender> = { men: "MEN", women: "WOMEN", unisex: "UNISEX" };

const first = (v: unknown): string | undefined => {
  const value = Array.isArray(v) ? v[0] : v;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

const price = (v: unknown): number | undefined => {
  const raw = first(v);
  const n = raw === undefined ? NaN : Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

/** Turns ?category=&gender=&q=&minPrice=&maxPrice=&sort=&page=&limit= into a safe filter object. */
export function parseProductQuery(query: Record<string, unknown>): ProductQuery {
  const category = first(query.category)?.toLowerCase();
  const gender = GENDERS[first(query.gender)?.toLowerCase() ?? ""] ?? (category ? GENDERS[category] : undefined);
  const sortRaw = first(query.sort) as ProductSort | undefined;
  let minPrice = price(query.minPrice);
  let maxPrice = price(query.maxPrice);
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];

  return {
    // "men" and "women" in ?category= are really genders (the storefront menu links use them)
    ...(category && !GENDERS[category] ? { category } : {}),
    ...(gender ? { gender } : {}),
    ...(first(query.q ?? query.search) ? { search: first(query.q ?? query.search) } : {}),
    ...(minPrice !== undefined ? { minPrice } : {}),
    ...(maxPrice !== undefined ? { maxPrice } : {}),
    sort: sortRaw && SORTS.includes(sortRaw) ? sortRaw : "newest",
    ...parsePagination(query, { defaultLimit: 12, maxLimit: 48 }),
  };
}
