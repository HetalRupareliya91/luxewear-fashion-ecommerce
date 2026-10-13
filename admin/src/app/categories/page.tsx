import { PageHeader } from "@/components/ui/PageHeader";
import { adminProducts } from "@/data/products";
import { formatMoney } from "@/lib/format";
import type { Category } from "@/lib/types";

const CATEGORIES: Category[] = ["Women", "Men", "Accessories"];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Product counts per category (sample data)." />
      <div className="grid gap-5 sm:grid-cols-3">
        {CATEGORIES.map((name) => {
          const items = adminProducts.filter((p) => p.category === name);
          const avg = items.length ? items.reduce((s, p) => s + p.price, 0) / items.length : 0;
          return (
            <div key={name} className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold">{name}</h2>
              <p className="mt-3 text-3xl font-bold">{items.length}</p>
              <p className="text-sm text-gray-500">products · average price {formatMoney(avg)}</p>
              <ul className="mt-4 space-y-1 text-sm text-gray-600">{items.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
