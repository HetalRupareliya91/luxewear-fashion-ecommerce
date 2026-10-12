export function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" method="get" role="search" className="flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        aria-label="Search products"
        placeholder="Search dresses, blazers, bags…"
        className="min-w-0 flex-1 rounded-full border px-5 py-3 outline-none focus:border-black"
      />
      <button type="submit" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">Search</button>
    </form>
  );
}
