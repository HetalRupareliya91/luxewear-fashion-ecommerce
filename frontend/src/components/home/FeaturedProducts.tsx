import Link from "next/link";
import { Container } from "@/components/common/Container";
import { ProductGrid } from "@/components/product/ProductGrid";

export function FeaturedProducts() {
  return (
    <section className="border-y bg-gray-50 py-20">
      <Container>
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
              Curated for you
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Pieces
            </h2>
          </div>

          <Link
            href="/shop"
            className="hidden rounded-full border border-black px-5 py-2 text-sm font-semibold transition hover:bg-black hover:text-white sm:block"
          >
            View all
          </Link>
        </div>

        <div className="mt-10">
          <ProductGrid featured limit={4} />
        </div>
      </Container>
    </section>
  );
}
