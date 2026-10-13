import { SalesChart } from "@/components/analytics/SalesChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StatCard } from "@/components/dashboard/StatCard";
import { customers } from "@/data/customers";
import { adminOrders } from "@/data/orders";
import { adminProducts } from "@/data/products";
import { revenueByDay } from "@/lib/analytics";
import { formatMoney, formatNumber } from "@/lib/format";
import { dashboardStats } from "@/lib/stats";

export default function DashboardPage() {
  const stats = dashboardStats(adminOrders, customers, adminProducts);
  const chart = revenueByDay(adminOrders).map((d) => ({ label: d.date.slice(5), value: d.revenue }));

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your fashion store (sample data).</p>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Revenue" value={formatMoney(stats.revenue)} note="Paid, shipped and delivered orders" />
        <StatCard title="Orders" value={formatNumber(stats.orders)} note={`${stats.openOrders} need attention`} />
        <StatCard title="Customers" value={formatNumber(stats.customers)} />
        <StatCard title="Active products" value={formatNumber(stats.activeProducts)} note={`${stats.lowStock} low · ${stats.outOfStock} out of stock`} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 lg:col-span-2">
          <h2 className="font-semibold">Sales Overview</h2>
          <SalesChart data={chart} />
        </div>
        <RecentActivity orders={adminOrders} />
      </div>
    </div>
  );
}
