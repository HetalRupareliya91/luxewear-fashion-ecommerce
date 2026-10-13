import type { Metadata } from "next";
import Link from "next/link";
import { brandValues } from "@/data/values";

export const metadata: Metadata = { title: "About | LuxeWear" };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">About LuxeWear</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">Fashion designed for modern life.</h1>
      <p className="mt-8 text-lg leading-8 text-gray-600">LuxeWear is a modern fashion concept focused on versatile, comfortable and timeless clothing.</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {brandValues.map((v) => (
          <div key={v.title} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{v.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/shop" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">Shop the collection</Link>
        <Link href="/contact" className="rounded-full border px-6 py-3 text-sm font-semibold hover:border-black">Contact us</Link>
      </div>
    </section>
  );
}
