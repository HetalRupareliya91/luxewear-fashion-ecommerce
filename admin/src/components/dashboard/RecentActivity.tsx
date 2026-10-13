import Link from "next/link";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { formatMoney } from "@/lib/format";
import { getCustomer, orderTotal } from "@/lib/orders";
import type { AdminOrder } from "@/lib/types";

export function RecentActivity({ orders }: { orders: AdminOrder[] }) {
  const latest = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="font-semibold">Recent Orders</h2>
      <ul className="mt-5 space-y-4">
        {latest.map((o) => (
          <li key={o.id} className="flex items-center justify-between gap-3 text-sm">
            <div>
              <Link href={`/orders/${o.id}`} className="font-medium hover:underline">{o.id}</Link>
              <p className="text-gray-500">{getCustomer(o.customerId)?.name} · {formatMoney(orderTotal(o))}</p>
            </div>
            <OrderStatusBadge status={o.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
