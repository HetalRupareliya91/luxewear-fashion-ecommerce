"use client";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-10 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-gray-500">{error.message || "Please try again."}</p>
      <button type="button" onClick={reset} className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
    </div>
  );
}
