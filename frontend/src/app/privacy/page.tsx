import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy | LuxeWear" };

const sections = [
  ["What we collect", "Details you give us when you order or contact us (name, email, delivery address, phone) and basic information about how the site is used."],
  ["How we use it", "To process and deliver orders, answer your questions and, if you opt in, send our newsletter. We do not sell your personal information."],
  ["Storage on your device", "This demo store keeps your cart, wishlist and order history in your browser's local storage. Clearing your browser data removes them."],
  ["Your choices", "You can unsubscribe from emails at any time and ask us to access, correct or delete your information by contacting us."],
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Legal</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Privacy policy</h1>
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
