"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { useToast } from "@/components/common/Toast";
import { ApiError } from "@/services/api";
import { cancelOrder, fetchOrder, type ApiOrder } from "@/services/orders";
import { formatCents } from "@/utils/money";
import { canCustomerCancel } from "@/utils/orderStatus";

function OrderDetail({ id }: { id: string }) {
  const toast = useToast();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchOrder(id)
      .then((o) => !cancelled && setOrder(o))
      .catch((e) => !cancelled && setError(e instanceof ApiError && e.status === 404 ? "We could not find that order." : e instanceof ApiError ? e.message : "Could not load this order."));
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function cancel() {
    if (!order || !window.confirm("Cancel this order?")) return;
    setBusy(true);
    try {
      setOrder(await cancelOrder(order.id));
      toast.show("Order cancelled");
    } catch (e) {
      toast.show(e instanceof ApiError ? e.message : "Could not cancel the order");
    } finally {
      setBusy(false);
    }
  }

  if (error) return <p role="alert" className="mt-8 text-red-600">{error}</p>;
  if (!order) return <p className="mt-8 text-gray-500">Loading…</p>;

  const a = order.shippingAddress;
  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
      <section>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{order.number}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-gray-500">Placed {new Date(order.createdAt).toLocaleString()}</p>
        <ul className="mt-6 divide-y rounded-2xl border">
          {order.items.map((l) => (
            <li key={l.sku} className="flex justify-between gap-4 p-4 text-sm">
              <span>{l.name}{l.size ? ` (${l.size})` : ""}{l.color ? `, ${l.color}` : ""} × {l.quantity}</span>
              <span className="font-medium">{formatCents(l.unitPrice * l.quantity)}</span>
            </li>
          ))}
        </ul>
        {canCustomerCancel(order.status) ? <Button type="button" className="mt-6 bg-white !text-black ring-1 ring-black hover:!bg-gray-100" disabled={busy} onClick={cancel}>{busy ? "Cancelling…" : "Cancel order"}</Button> : null}
      </section>
      <aside className="h-fit space-y-6 rounded-2xl border bg-gray-50 p-6 text-sm">
        <dl className="space-y-2">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatCents(order.subtotal)}</dd></div>
          {order.discount > 0 ? <div className="flex justify-between"><dt>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt><dd>-{formatCents(order.discount)}</dd></div> : null}
          <div className="flex justify-between"><dt>Shipping ({order.shippingMethod})</dt><dd>{order.shipping === 0 ? "Free" : formatCents(order.shipping)}</dd></div>
          <div className="flex justify-between"><dt>Tax</dt><dd>{formatCents(order.tax)}</dd></div>
          <div className="flex justify-between border-t pt-2 text-base font-semibold"><dt>Total</dt><dd>{formatCents(order.total)}</dd></div>
        </dl>
        <div>
          <h2 className="font-semibold">Delivering to</h2>
          <p className="mt-1 text-gray-600">{a.firstName} {a.lastName}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />{a.city}{a.state ? `, ${a.state}` : ""} {a.postalCode}<br />{a.country}</p>
        </div>
      </aside>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <Container className="py-12">
      <Link href="/account" className="text-sm underline">← Back to your account</Link>
      <RequireAuth><OrderDetail id={id} /></RequireAuth>
    </Container>
  );
}
