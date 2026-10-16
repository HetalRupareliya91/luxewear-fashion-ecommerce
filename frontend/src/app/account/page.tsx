"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/common/Container";
import { ProfileCard } from "@/components/account/ProfileCard";
import { ApiOrderList } from "@/components/account/ApiOrderList";
import { EmptyState } from "@/components/common/EmptyState";
import { ORDERS_STORAGE_KEY, loadOrders, type Order } from "@/store/orders";
import { formatPrice } from "@/utils/format";

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  function clearHistory() {
    window.localStorage.removeItem(ORDERS_STORAGE_KEY);
    setOrders([]);
  }

  return (
    <Container className="py-12">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your orders</h1>
        {orders && orders.length > 0 ? <button type="button" onClick={clearHistory} className="text-sm underline">Clear history</button> : null}
      </div>
      <ProfileCard />
      <ApiOrderList />
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Orders on this device</h2>
        {orders === null ? <p className="text-gray-500">Loading…</p> : orders.length === 0 ? (
          <EmptyState title="No orders yet" message="Orders you place will show up here." actionLabel="Start shopping" actionHref="/shop" />
        ) : (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li key={o.id} className="rounded-2xl border p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/order/success?id=${o.id}`} className="font-semibold hover:underline">{o.id}</Link>
                  <span className="text-sm text-gray-500">{new Date(o.placedAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{o.lines.map((l) => `${l.name} × ${l.quantity}`).join(", ")}</p>
                <p className="mt-2 font-semibold">{formatPrice(o.totals.total)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
