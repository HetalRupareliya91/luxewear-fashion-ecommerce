import { ShopHeader } from "@/components/catalog/ShopHeader";
import { ProductGrid } from "@/components/product/ProductGrid";

export default function ShopPage() {
  return <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <ShopHeader />
    <ProductGrid />
  </section>;
}
