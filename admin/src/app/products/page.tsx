"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminProducts } from "@/data/products";
import { formatMoney } from "@/lib/format";
import { stockLevel } from "@/lib/stats";
import type { AdminProduct } from "@/lib/types";

const columns: Column<AdminProduct>[] = [
  { key: "name", header: "Product", render: (p) => <div><p className="font-medium">{p.name}</p><p className="text-xs text-gray-500">{p.sku}</p></div> },
  { key: "category", header: "Category", render: (p) => p.category },
  { key: "price", header: "Price", align: "right", render: (p) => formatMoney(p.price) },
  { key: "stock", header: "Stock", align: "right", render: (p) => p.stock },
  { key: "level", header: "Availability", render: (p) => { const l = stockLevel(p.stock); return <StatusBadge label={l === "out" ? "Out of stock" : l === "low" ? "Low stock" : "In stock"} tone={l === "out" ? "red" : l === "low" ? "amber" : "green"} />; } },
  { key: "status", header: "Status", render: (p) => <StatusBadge label={p.status === "active" ? "Active" : "Draft"} tone={p.status === "active" ? "blue" : "gray"} /> },
];

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "draft">("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adminProducts.filter((p) => (status === "all" || p.status === status) && (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)));
  }, [query, status]);

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description={`${rows.length} of ${adminProducts.length} products`} />
      <div className="flex flex-wrap gap-3">
        <input type="search" aria-label="Search products" placeholder="Search by name or SKU" value={query} onChange={(e) => setQuery(e.target.value)} className="w-72 rounded-lg border bg-white px-4 py-2 text-sm outline-none focus:border-black" />
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="rounded-lg border bg-white px-3 py-2 text-sm">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <DataTable columns={columns} rows={rows} rowKey={(p) => p.id} empty="No products match your search." />
    </div>
  );
}
