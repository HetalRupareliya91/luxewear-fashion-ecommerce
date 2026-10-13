type ShopHeaderProps = { title?: string; count?: number };

export function ShopHeader({ title = "Shop All", count }: ShopHeaderProps) {
  return (
    <div className="border-b pb-8">
      <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Collection</p>
      <h1 className="mt-3 text-4xl font-bold">{title}</h1>
      {count !== undefined ? <p className="mt-2 text-sm text-gray-500">{count} {count === 1 ? "product" : "products"}</p> : null}
    </div>
  );
}
