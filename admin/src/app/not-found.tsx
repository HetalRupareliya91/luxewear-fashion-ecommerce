import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">404</p>
      <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-gray-500">This admin page does not exist.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white">Back to dashboard</Link>
    </div>
  );
}
