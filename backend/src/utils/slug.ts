/** "Café & Crème Blazer!" -> "cafe-and-creme-blazer" */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

/** Returns a slug that is not in `taken`, adding -2, -3, ... when needed. */
export function uniqueSlug(base: string, taken: Iterable<string>): string {
  const used = new Set(taken);
  const slug = slugify(base) || "item";
  if (!used.has(slug)) return slug;
  let i = 2;
  while (used.has(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
}
