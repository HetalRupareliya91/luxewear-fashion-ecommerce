import { featuredProducts, products } from "@/data/products";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  limit?: number;
  featured?: boolean;
};

export function ProductGrid({
  limit,
  featured = false,
}: ProductGridProps) {
  const source = featured ? featuredProducts : products;
  const items = limit ? source.slice(0, limit) : source;

  return (
    <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
