import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Returns | LuxeWear" };

const steps = [
  "Contact us within 30 days of delivery with your order number.",
  "Pack the items unworn, with tags attached, in the original packaging if possible.",
  "Send the parcel using the return label we email you.",
  "Once we receive and check the items, your refund is issued to the original payment method within 5-7 business days.",
];

export default function ReturnsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Customer care</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Returns and exchanges</h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">Not quite right? Return unworn items within 30 days for a full refund or exchange them for another size.</p>
      <ol className="mt-8 list-decimal space-y-4 pl-6 leading-7 text-gray-700">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
      <h2 className="mt-12 text-xl font-semibold">Good to know</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-gray-700">
        <li>Sale items can be exchanged but not refunded.</li>
        <li>Accessories must be returned in their original condition.</li>
        <li>Return shipping is free for exchanges.</li>
      </ul>
      <p className="mt-10 text-gray-600">Questions? <Link href="/contact" className="font-semibold underline">Get in touch</Link>.</p>
    </section>
  );
}
