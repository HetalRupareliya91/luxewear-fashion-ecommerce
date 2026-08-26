import Link from "next/link";
import { Container } from "@/components/common/Container";
export function HeroSection() {
  return <section className="bg-gray-100"><Container><div className="grid min-h-[600px] items-center gap-12 py-20 lg:grid-cols-2">
    <div className="max-w-xl"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">New Season 2026</p><h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">Style that speaks for you.</h1><p className="mt-6 text-lg leading-8 text-gray-600">Discover thoughtfully designed fashion made for modern lifestyles.</p><div className="mt-8 flex gap-4"><Link href="/shop" className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white">Shop Collection</Link><Link href="/shop?sort=newest" className="rounded-full border border-black px-7 py-3 text-sm font-semibold">New Arrivals</Link></div></div>
    <div className="flex h-[420px] items-center justify-center rounded-2xl bg-gray-200"><div className="text-center"><p className="text-sm uppercase tracking-[0.3em] text-gray-500">LuxeWear</p><p className="mt-3 text-3xl font-semibold">Fashion Collection</p></div></div>
  </div></Container></section>;
}
