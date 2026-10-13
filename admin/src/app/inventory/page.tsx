import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminProducts } from "@/data/products";
import { LOW_STOCK_THRESHOLD, dashboardStats, stockLevel } from "@/lib/stats";
import { adminOrders } from "@/data/orders";
import { customers } from "@/data/customers";
import type { AdminProduct } from "@/lib/types";

const columns: Column<AdminProduct>[] = [
  { key: "name", header: "Product", render: (p) => <div><p className="font-medium">{p.name}</p><p className="text-xs text-gray-500">{p.sku}</p></div> },
  { key: "stock", header: "On hand", align: "right", render: (p) => p.stock },
  { key: "level", header: "Level", render: (p) => { const l = stockLevel(p.stock); return <StatusBadge label={l === "out" ? "Out of stock" : l === "low" ? "Low stock" : "Healthy"} tone={l === "out" ? "red" : l === "low" ? "amber" : "green"} />; } },
];

export default function InventoryPage() {
  const stats = dashboardStats(adminOrders, customers, adminProducts);
  const rows = [...adminProducts].sort((a, b) => a.stock - b.stock);
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description={`Low stock means ${LOW_STOCK_THRESHOLD} units or fewer.`} />
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard title="Out of stock" value={String(stats.outOfStock)} note="Needs restocking now" />
        <StatCard title="Low stock" value={String(stats.lowStock)} note="Reorder soon" />
        <StatCard title="Total units" value={String(adminProducts.reduce((s, p) => s + p.stock, 0))} note="Across all products" />
      </div>
      <DataTable columns={columns} rows={rows} rowKey={(p) => p.id} />
    </div>
  );
}
