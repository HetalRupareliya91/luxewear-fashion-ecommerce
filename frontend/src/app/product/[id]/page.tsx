import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { RatingStars } from "@/components/product/RatingStars";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { products } from "@/data/products";
import { getProductDetails } from "@/data/productDetails";
import { getProductById } from "@/utils/catalog";
import { discountPercent, formatPrice } from "@/utils/format";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getProductById(products, (await params).id);
  return product ? { title: `${product.name} | LuxeWear`, description: getProductDetails(product.id).description } : { title: "Product not found | LuxeWear" };
}

export default async function ProductPage({ params }: PageProps) {
  const product = getProductById(products, (await params).id);
  if (!product) notFound();

  const details = getProductDetails(product.id);
  const saving = discountPercent(product.price, product.compareAtPrice);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: product.category, href: `/shop?category=${product.category.toLowerCase()}` }, { label: product.name }]} />

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
          <Image src={product.image} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{product.name}</h1>
          {details.reviewCount > 0 ? <div className="mt-3"><RatingStars rating={details.rating} count={details.reviewCount} /></div> : null}

          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
            {product.compareAtPrice ? <p className="text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</p> : null}
            {saving > 0 ? <p className="text-sm font-semibold text-red-600">Save {saving}%</p> : null}
          </div>

          <p className="mt-6 leading-7 text-gray-600">{details.description}</p>

          <ProductPurchase productId={product.id} sizes={details.sizes} />

          <div className="mt-8 divide-y border-y text-sm">
            <details className="py-4" open>
              <summary className="cursor-pointer font-semibold">Details and care</summary>
              <p className="mt-3 text-gray-600">Material: {details.material}</p>
              <p className="mt-1 text-gray-600">Care: {details.care}</p>
            </details>
            <details className="py-4">
              <summary className="cursor-pointer font-semibold">Shipping and returns</summary>
              <p className="mt-3 text-gray-600">Free standard shipping on orders over $150. Returns accepted within 30 days in original condition.</p>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="text-2xl font-bold">You may also like</h2>
          <div className="mt-8"><ProductGrid items={related} /></div>
        </section>
      ) : null}
    </Container>
  );
}
