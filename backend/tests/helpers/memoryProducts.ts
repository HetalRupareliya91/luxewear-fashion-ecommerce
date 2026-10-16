import type { AdminProduct, ProductAdminRepository } from "../../src/modules/products/product.admin.js";

/** In-memory ProductAdminRepository. Category ids "c1" and "c2" exist. */
export function createMemoryProducts() {
  const items: AdminProduct[] = [];
  const repo: ProductAdminRepository & { items: AdminProduct[] } = {
    items,
    async list({ status, search, skip, limit }) {
      const q = search?.toLowerCase();
      const matching = items.filter((p) => (!status || p.status === status) && (!q || p.name.toLowerCase().includes(q)));
      return { items: matching.slice(skip, skip + limit), total: matching.length };
    },
    async findById(id) {
      return items.find((p) => p.id === id) ?? null;
    },
    async categoryExists(id) {
      return id === "c1" || id === "c2";
    },
    async slugsLike(base) {
      return items.map((p) => p.slug).filter((s) => s === base || s.startsWith(`${base}-`));
    },
    async takenSkus(skus) {
      const used = new Set(items.flatMap((p) => p.variants.map((v) => v.sku)));
      return skus.filter((s) => used.has(s));
    },
    async create(product) {
      const record: AdminProduct = {
        id: `p${items.length + 1}`,
        name: product.name,
        slug: product.slug,
        description: product.description ?? null,
        price: product.price,
        status: product.status,
        gender: product.gender,
        categoryId: product.categoryId,
        variants: product.variants.map((v) => ({ sku: v.sku, size: v.size ?? null, color: v.color ?? null, price: v.price ?? null, stock: v.stock })),
        images: product.images.map((i) => ({ url: i.url, altText: i.altText ?? null })),
      };
      items.push(record);
      return record;
    },
    async update(id, patch) {
      const product = items.find((p) => p.id === id)!;
      Object.assign(product, { ...patch, description: patch.description === undefined ? product.description : patch.description || null });
      return product;
    },
    async setStock(sku, stock) {
      const variant = items.flatMap((p) => p.variants).find((v) => v.sku === sku);
      if (!variant) return null;
      variant.stock = stock;
      return { sku, stock };
    },
  };
  return repo;
}
