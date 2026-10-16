import { prisma } from "../../config/prisma.js";
import type { AdminProduct, ProductAdminRepository } from "./product.admin.js";

const include = { variants: { orderBy: { sku: "asc" } }, images: { orderBy: { sortOrder: "asc" } } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toAdminProduct = (row: any): AdminProduct => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  price: Number(row.price),
  status: row.status,
  gender: row.gender,
  categoryId: row.categoryId,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants: row.variants.map((v: any) => ({ sku: v.sku, size: v.size, color: v.color, price: v.price === null ? null : Number(v.price), stock: v.stock })),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: row.images.map((i: any) => ({ url: i.url, altText: i.altText })),
});

/** Prisma implementation of ProductAdminRepository. */
export const prismaProductAdminRepository: ProductAdminRepository = {
  async list({ status, search, skip, limit }) {
    const where = { ...(status ? { status } : {}), ...(search ? { name: { contains: search, mode: "insensitive" } } : {}) };
    const [rows, total] = await Promise.all([prisma.product.findMany({ where, include, orderBy: { createdAt: "desc" }, skip, take: limit }), prisma.product.count({ where })]);
    return { items: rows.map(toAdminProduct), total };
  },

  async findById(id) {
    const row = await prisma.product.findUnique({ where: { id }, include });
    return row ? toAdminProduct(row) : null;
  },

  async categoryExists(id) {
    return (await prisma.category.count({ where: { id } })) > 0;
  },

  async slugsLike(base) {
    const rows: { slug: string }[] = await prisma.product.findMany({ where: { slug: { startsWith: base } }, select: { slug: true } });
    return rows.map((r) => r.slug).filter((s) => s === base || s.startsWith(`${base}-`));
  },

  async takenSkus(skus) {
    const rows: { sku: string }[] = await prisma.productVariant.findMany({ where: { sku: { in: skus } }, select: { sku: true } });
    return rows.map((r) => r.sku);
  },

  async create(product) {
    const row = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        status: product.status,
        gender: product.gender,
        categoryId: product.categoryId,
        variants: { create: product.variants.map((v) => ({ sku: v.sku, size: v.size, color: v.color, price: v.price, stock: v.stock })) },
        images: { create: product.images.map((img, index) => ({ url: img.url, altText: img.altText, sortOrder: index })) },
      },
      include,
    });
    return toAdminProduct(row);
  },

  async update(id, patch) {
    return toAdminProduct(await prisma.product.update({ where: { id }, data: { ...patch, description: patch.description === undefined ? undefined : patch.description || null }, include }));
  },

  async setStock(sku, stock) {
    const result = await prisma.productVariant.updateMany({ where: { sku }, data: { stock } });
    return result.count > 0 ? { sku, stock } : null;
  },
};
