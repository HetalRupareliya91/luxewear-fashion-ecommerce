import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group">
      <Link href={`/shop?product=${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {product.badge ? (
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
              {product.badge}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
            {product.category}
          </p>
          <Link
            href={`/shop?product=${product.id}`}
            className="mt-1 block font-semibold hover:underline"
          >
            {product.name}
          </Link>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-semibold">${product.price}</p>
          {product.compareAtPrice ? (
            <p className="text-xs text-gray-400 line-through">
              ${product.compareAtPrice}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
