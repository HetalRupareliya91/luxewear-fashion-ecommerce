export const WISHLIST_STORAGE_KEY = "luxewear.wishlist.v1";

export const toggleWishlist = (ids: string[], id: string): string[] => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);

/** Keeps only string ids and removes duplicates. */
export function parseStoredWishlist(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? [...new Set(data.filter((x): x is string => typeof x === "string"))] : [];
  } catch {
    return [];
  }
}
