import { AppError } from "../../errors/AppError.js";
import { buildMeta } from "../../utils/pagination.js";
import { slugify, uniqueSlug } from "../../utils/slug.js";
import type { ProductInput, ProductPatch, ProductStatus } from "../../validators/products.js";

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  /** Dollars, like the public catalogue. */
  price: number;
  status: ProductStatus;
  gender: string;
  categoryId: string;
  variants: { sku: string; size: string | null; color: string | null; price: number | null; stock: number }[];
  images: { url: string; altText: string | null }[];
};

export type NewProduct = ProductInput & { slug: string };

export type ProductAdminRepository = {
  list(filter: { status?: ProductStatus; search?: string; skip: number; limit: number }): Promise<{ items: AdminProduct[]; total: number }>;
  findById(id: string): Promise<AdminProduct | null>;
  categoryExists(id: string): Promise<boolean>;
  /** Slugs equal to `base` or starting with `base-`. */
  slugsLike(base: string): Promise<string[]>;
  /** Which of these SKUs already belong to some product. */
  takenSkus(skus: string[]): Promise<string[]>;
  create(product: NewProduct): Promise<AdminProduct>;
  update(id: string, patch: ProductPatch): Promise<AdminProduct>;
  /** Returns null when the SKU does not exist. */
  setStock(sku: string, stock: number): Promise<{ sku: string; stock: number } | null>;
};

export type ProductAdminService = ReturnType<typeof createProductAdminService>;

export function createProductAdminService({ products }: { products: ProductAdminRepository }) {
  async function requireCategory(id: string) {
    if (!(await products.categoryExists(id))) throw AppError.badRequest("Validation failed", { categoryId: "That category does not exist" });
  }

  return {
    async list(filter: { status?: ProductStatus; search?: string; skip: number; limit: number; page: number }) {
      const { items, total } = await products.list({ status: filter.status, search: filter.search?.trim() || undefined, skip: filter.skip, limit: filter.limit });
      return { items, meta: buildMeta(filter.page, filter.limit, total) };
    },

    async get(id: string) {
      const product = await products.findById(id);
      if (!product) throw AppError.notFound("Product not found");
      return product;
    },

    async create(input: ProductInput) {
      await requireCategory(input.categoryId);
      const taken = await products.takenSkus(input.variants.map((v) => v.sku));
      if (taken.length) throw AppError.conflict(`SKU already in use: ${taken.join(", ")}`);
      const base = slugify(input.name) || "product";
      return products.create({ ...input, slug: uniqueSlug(base, await products.slugsLike(base)) });
    },

    async update(id: string, patch: ProductPatch) {
      await this.get(id);
      if (patch.categoryId) await requireCategory(patch.categoryId);
      return products.update(id, patch);
    },

    /** Products are archived, not deleted, so old orders and reviews keep pointing at something real. */
    async archive(id: string) {
      await this.get(id);
      return products.update(id, { status: "ARCHIVED" });
    },

    async setStock(sku: string, stock: number) {
      const result = await products.setStock(sku, stock);
      if (!result) throw AppError.notFound("SKU not found");
      return result;
    },
  };
}
