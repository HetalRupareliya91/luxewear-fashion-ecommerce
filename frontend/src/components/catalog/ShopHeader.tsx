export function ShopHeader() {
 return <div className="flex flex-col justify-between gap-5 border-b pb-8 sm:flex-row sm:items-end"><div><p className="text-sm uppercase tracking-[0.25em] text-gray-500">Collection</p><h1 className="mt-3 text-4xl font-bold">Shop All</h1></div><div className="flex gap-3"><button className="rounded-full border px-5 py-2 text-sm">Filter</button><button className="rounded-full border px-5 py-2 text-sm">Sort</button></div></div>;
}
