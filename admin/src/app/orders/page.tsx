"use client";

import Link from "next/link";
import { useState } from "react";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminOrders } from "@/data/orders";
import { formatDate, formatMoney } from "@/lib/format";
import { ALL_STATUSES } from "@/lib/orderStatus";
import { getCustomer, orderTotal, orderUnits } from "@/lib/orders";
import type { AdminOrder, OrderStatus } from "@/lib/types";

const columns: Column<AdminOrder>[] = [
  { key: "id", header: "Order", render: (o) => <Link href={`/orders/${o.id}`} className="font-semibold hover:underline">{o.id}</Link> },
  { key: "date", header: "Date", render: (o) => formatDate(o.createdAt) },
  { key: "customer", header: "Customer", render: (o) => getCustomer(o.customerId)?.name ?? "Unknown" },
  { key: "items", header: "Items", align: "right", render: (o) => orderUnits(o) },
  { key: "total", header: "Total", align: "right", render: (o) => formatMoney(orderTotal(o)) },
  { key: "status", header: "Status", render: (o) => <OrderStatusBadge status={o.status} /> },
];

export default function OrdersPage() {
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const rows = [...adminOrders].filter((o) => status === "ALL" || o.status === status).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const count = (s: OrderStatus) => adminOrders.filter((o) => o.status === s).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description={`${rows.length} of ${adminOrders.length} orders`} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {(["ALL", ...ALL_STATUSES] as const).map((s) => (
          <button key={s} type="button" onClick={() => setStatus(s)} aria-pressed={status === s} className={`rounded-full border px-4 py-1.5 text-sm ${status === s ? "border-black bg-black text-white" : "bg-white hover:border-black"}`}>
            {s === "ALL" ? `All (${adminOrders.length})` : `${s[0] + s.slice(1).toLowerCase()} (${count(s)})`}
          </button>
        ))}
      </div>
      <DataTable columns={columns} rows={rows} rowKey={(o) => o.id} empty="No orders with this status." />
    </div>
  );
}
