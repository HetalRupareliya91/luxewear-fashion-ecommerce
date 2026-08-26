import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";

export function HeroSection() {
  return (
    <section className="bg-neutral-100">
      <Container>
        <div className="grid min-h-[650px] items-center gap-10 py-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="max-w-xl py-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
              New Season 2026
            </p>

            <h1 className="mt-5 text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Style that speaks for you.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
              Elevated everyday pieces designed around clean silhouettes,
              premium textures and effortless confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Shop Collection
              </Link>

              <Link
                href="/shop?sort=newest"
                className="rounded-full border border-black px-7 py-3 text-sm font-semibold transition hover:bg-white"
              >
                New Arrivals
              </Link>
            </div>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-5 border-t pt-6 text-sm">
              <div>
                <strong className="block text-lg">24h</strong>
                <span className="text-gray-500">Dispatch</span>
              </div>
              <div>
                <strong className="block text-lg">30d</strong>
                <span className="text-gray-500">Easy returns</span>
              </div>
              <div>
                <strong className="block text-lg">4.9/5</strong>
                <span className="text-gray-500">Customer rating</span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-gray-200">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=90"
              alt="LuxeWear seasonal fashion collection"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />

            <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              LuxeWear / 01
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
