import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopHeader } from "@/components/catalog/ShopHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryTabs } from "@/components/shop/CategoryTabs";
import { ClearFilters } from "@/components/shop/ClearFilters";
import { SortSelect } from "@/components/shop/SortSelect";
import { products } from "@/data/products";
import { filterProducts, parseShopParams, type SearchParams } from "@/utils/catalog";

export const metadata: Metadata = { title: "Shop | LuxeWear" };

const TITLES: Record<string, string> = { women: "Women", men: "Men", accessories: "Accessories" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filter = parseShopParams(await searchParams);
  const items = filterProducts(products, filter);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ShopHeader title={filter.category ? (TITLES[filter.category] ?? "Shop") : "Shop All"} count={items.length} />
      <Suspense>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <CategoryTabs />
          <div className="flex flex-wrap items-center gap-4">
            <SortSelect />
            <ClearFilters />
          </div>
        </div>
      </Suspense>
      <div className="mt-10">
        {items.length === 0 ? <EmptyState title="No products match your filters" message="Try a different category or clear your filters." actionLabel="Clear filters" actionHref="/shop" /> : <ProductGrid items={items} />}
      </div>
    </section>
  );
}
