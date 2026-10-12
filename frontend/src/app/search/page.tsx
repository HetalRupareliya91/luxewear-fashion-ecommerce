import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchForm } from "@/components/shop/SearchForm";
import { products } from "@/data/products";
import { filterProducts, parseShopParams, type SearchParams } from "@/utils/catalog";

export const metadata: Metadata = { title: "Search | LuxeWear" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { search } = parseShopParams(await searchParams);
  const results = search ? filterProducts(products, { search }) : [];

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold tracking-tight">Search</h1>
      <div className="mt-6 max-w-2xl"><SearchForm defaultValue={search ?? ""} /></div>
      <div className="mt-10">
        {!search ? (
          <p className="text-gray-500">Type a product name or category to get started.</p>
        ) : results.length === 0 ? (
          <EmptyState title={`No results for “${search}”`} message="Check the spelling or try a broader term like “dress” or “bag”." actionLabel="Browse the shop" actionHref="/shop" />
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-500">{results.length} {results.length === 1 ? "result" : "results"} for “{search}”</p>
            <ProductGrid items={results} />
          </>
        )}
      </div>
    </Container>
  );
}
