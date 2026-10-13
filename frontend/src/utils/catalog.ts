import type { Product } from "@/data/products";

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name";
export type CatalogFilter = { category?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: SortKey };
export type SearchParams = Record<string, string | string[] | undefined>;

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
const toPrice = (value: string | undefined) => {
  const n = value === undefined || value === "" ? NaN : Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

/** Reads ?category=&q=&minPrice=&maxPrice=&sort= from the URL into a safe filter. */
export function parseShopParams(params: SearchParams): CatalogFilter {
  let minPrice = toPrice(one(params.minPrice));
  let maxPrice = toPrice(one(params.maxPrice));
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];
  const sort = one(params.sort) as SortKey | undefined;
  return {
    category: one(params.category)?.trim().toLowerCase() || undefined,
    search: one(params.q)?.trim() || undefined,
    minPrice,
    maxPrice,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : undefined,
  };
}

export function filterProducts(list: Product[], filter: CatalogFilter): Product[] {
  const term = filter.search?.toLowerCase();
  const out = list.filter(
    (p) =>
      (!filter.category || p.category.toLowerCase() === filter.category) &&
      (!term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)) &&
      (filter.minPrice === undefined || p.price >= filter.minPrice) &&
      (filter.maxPrice === undefined || p.price <= filter.maxPrice),
  );
  switch (filter.sort) {
    case "price-asc":
      return [...out].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...out].sort((a, b) => b.price - a.price);
    case "name":
      return [...out].sort((a, b) => a.name.localeCompare(b.name));
    case "newest": // items badged "New" first, then the most recently added ids
      return [...out].sort((a, b) => Number(b.badge === "New") - Number(a.badge === "New") || b.id.localeCompare(a.id));
    default:
      return out;
  }
}

export const getProductById = (list: Product[], id: string) => list.find((p) => p.id === id);
