import { SalesChart } from "@/components/analytics/SalesChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminOrders } from "@/data/orders";
import { adminProducts } from "@/data/products";
import { averageOrderValue, revenueByDay, topProducts } from "@/lib/analytics";
import { formatMoney } from "@/lib/format";

type Row = ReturnType<typeof topProducts>[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Product", render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "units", header: "Units sold", align: "right", render: (r) => r.units },
  { key: "revenue", header: "Revenue", align: "right", render: (r) => formatMoney(r.revenue) },
];

export default function AnalyticsPage() {
  const days = revenueByDay(adminOrders);
  const best = days.reduce((a, b) => (b.revenue > a.revenue ? b : a), days[0]);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Sample data. Only paid, processing, shipped and delivered orders count as revenue." />
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard title="Average order value" value={formatMoney(averageOrderValue(adminOrders))} />
        <StatCard title="Best day" value={best ? formatMoney(best.revenue) : "-"} note={best?.date} />
        <StatCard title="Days with sales" value={String(days.length)} />
      </div>
      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold">Revenue by day</h2>
        <SalesChart data={days.map((d) => ({ label: d.date.slice(5), value: d.revenue }))} />
      </div>
      <div>
        <h2 className="mb-3 font-semibold">Best sellers</h2>
        <DataTable columns={columns} rows={topProducts(adminOrders, adminProducts)} rowKey={(r) => r.productId} />
      </div>
    </div>
  );
}
