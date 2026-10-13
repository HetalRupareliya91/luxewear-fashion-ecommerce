import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusControl } from "@/components/orders/OrderStatusControl";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminOrders } from "@/data/orders";
import { adminProducts } from "@/data/products";
import { formatDate, formatMoney } from "@/lib/format";
import { getCustomer, getOrder, orderSubtotal, orderTotal } from "@/lib/orders";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const order = getOrder(adminOrders, (await params).id);
  if (!order) notFound();
  const customer = getCustomer(order.customerId);

  return (
    <div className="space-y-6">
      <Link href="/orders" className="text-sm text-gray-500 hover:text-black">← All orders</Link>
      <PageHeader title={`Order ${order.id}`} description={`Placed ${formatDate(order.createdAt)}`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-white">
            <h2 className="border-b px-5 py-4 font-semibold">Items</h2>
            <ul className="divide-y text-sm">
              {order.items.map((item) => (
                <li key={item.productId} className="flex justify-between px-5 py-4">
                  <span>{adminProducts.find((p) => p.id === item.productId)?.name ?? item.productId} × {item.quantity}</span>
                  <span>{formatMoney(item.quantity * item.unitPrice)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t px-5 py-4 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd>{formatMoney(orderSubtotal(order))}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Shipping</dt><dd>{order.shipping === 0 ? "Free" : formatMoney(order.shipping)}</dd></div>
              <div className="flex justify-between border-t pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatMoney(orderTotal(order))}</dd></div>
            </dl>
          </div>
        </div>
        <div className="space-y-6">
          <OrderStatusControl initial={order.status} />
          <div className="rounded-xl border bg-white p-5 text-sm">
            <p className="text-gray-500">Customer</p>
            <p className="mt-2 font-medium">{customer?.name ?? "Unknown"}</p>
            <p className="text-gray-500">{customer?.email}</p>
            <p className="text-gray-500">{customer?.city}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
