"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { ApiError } from "@/services/api";
import { fetchOrders, type ApiOrder } from "@/services/orders";
import { useAuth } from "@/store/AuthContext";
import { formatCents } from "@/utils/money";

/** Orders stored in the account (placed while signed in). Hidden for visitors. */
export function ApiOrderList() {
  const { user, ready } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    fetchOrders()
      .then((list) => !cancelled && setOrders(list))
      .catch((e) => !cancelled && setError(e instanceof ApiError ? e.message : "Could not load your orders."));
    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  if (!user) return null;
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Account orders</h2>
      {error ? <p role="alert" className="mt-3 text-sm text-red-600">{error}</p> : null}
      {orders === null && !error ? <p className="mt-3 text-gray-500">Loading…</p> : null}
      {orders && orders.length === 0 ? <p className="mt-3 text-sm text-gray-500">No orders on your account yet.</p> : null}
      {orders && orders.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link href={`/account/orders/${o.id}`} className="font-semibold hover:underline">{o.number}</Link>
                <OrderStatusBadge status={o.status} />
              </div>
              <p className="mt-2 text-sm text-gray-600">{o.items.map((l) => `${l.name}${l.size ? ` (${l.size})` : ""} × ${l.quantity}`).join(", ")}</p>
              <p className="mt-2 flex justify-between text-sm"><span className="text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</span><span className="font-semibold">{formatCents(o.total)}</span></p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
