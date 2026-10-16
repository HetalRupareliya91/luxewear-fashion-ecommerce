import "dotenv/config";
import { prisma } from "../src/config/prisma.js";
import { slugify } from "../src/utils/slug.js";
import { SEED_COUPONS, SEED_PRODUCTS, skuFor } from "./seedData.js";

/** Safe to run more than once: everything is matched by slug, SKU or code. Existing stock is not reset. */
async function main() {
  const categories = new Map<string, string>();
  for (const name of new Set(SEED_PRODUCTS.map((p) => p.category))) {
    const category = await prisma.category.upsert({ where: { slug: slugify(name) }, update: {}, create: { name, slug: slugify(name) } });
    categories.set(name, category.id);
  }

  for (const p of SEED_PRODUCTS) {
    const slug = slugify(p.name);
    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        status: "ACTIVE",
        gender: p.gender,
        categoryId: categories.get(p.category)!,
        images: { create: [{ url: p.image, altText: p.name, sortOrder: 0 }] },
      },
    });
    for (const size of p.sizes) {
      const sku = skuFor(p.key, size);
      await prisma.productVariant.upsert({ where: { sku }, update: {}, create: { sku, size, stock: p.stockPerSize, productId: product.id } });
    }
  }

  for (const coupon of SEED_COUPONS) {
    await prisma.coupon.upsert({ where: { code: coupon.code }, update: {}, create: coupon });
  }
  console.log(`Seeded ${SEED_PRODUCTS.length} products and ${SEED_COUPONS.length} coupons.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
