import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms | LuxeWear" };

const sections = [
  ["Orders", "An order is accepted when we confirm it by email. We may cancel an order if an item is unavailable or a pricing error occurs, and will refund any payment in full."],
  ["Prices and payment", "Prices are shown in US dollars and include no shipping or tax until checkout. Promotional codes cannot be combined unless stated."],
  ["Delivery", "Delivery estimates are not guarantees. Risk passes to you when the parcel is delivered."],
  ["Returns", "Unworn items can be returned within 30 days of delivery. See the returns page for the full process."],
];

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Legal</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Terms of service</h1>
      <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Template text. Have it reviewed by a legal adviser before the store goes live.</p>
      {sections.map(([title, body]) => (
        <div key={title} className="mt-8">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 leading-7 text-gray-600">{body}</p>
        </div>
      ))}
    </section>
  );
}
