import { featuredProducts, products, type Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  limit?: number;
  featured?: boolean;
  /** Show exactly these products instead of the default catalog. */
  items?: Product[];
};

export function ProductGrid({
  limit,
  featured = false,
  items: given,
}: ProductGridProps) {
  const source = given ?? (featured ? featuredProducts : products);
  const items = limit ? source.slice(0, limit) : source;

  return (
    <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
