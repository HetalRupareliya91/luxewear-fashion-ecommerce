import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/common/Accordion";
import { faqs } from "@/data/faq";

export const metadata: Metadata = { title: "FAQ | LuxeWear" };

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Customer care</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Frequently asked questions</h1>
      <div className="mt-10"><Accordion items={faqs} /></div>
      <p className="mt-8 text-gray-600">Still need help? <Link href="/contact" className="font-semibold underline">Contact us</Link>.</p>
    </section>
  );
}
