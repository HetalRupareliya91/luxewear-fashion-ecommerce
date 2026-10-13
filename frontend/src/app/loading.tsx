export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" role="status" aria-label="Loading">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-100" />)}
      </div>
    </div>
  );
}
