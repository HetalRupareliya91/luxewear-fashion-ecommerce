"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Container } from "@/components/common/Container";
import { loadOrders, type Order } from "@/store/orders";
import { formatPrice } from "@/utils/format";

function Confirmation() {
  const id = useSearchParams().get("id");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(loadOrders().find((o) => o.id === id) ?? null);
  }, [id]);

  if (order === undefined) return <p className="text-gray-500">Loading…</p>;
  if (order === null) return <p>We could not find that order. Check <Link href="/account" className="underline">your account</Link>.</p>;

  return (
    <div className="max-w-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">Order placed</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Thank you, {order.customer.firstName}!</h1>
      <p className="mt-3 text-gray-600">Your order number is <strong>{order.id}</strong>. A confirmation will be sent to {order.customer.email} once payments are connected.</p>
      <ul className="mt-6 divide-y border-y text-sm">
        {order.lines.map((l) => <li key={`${l.productId}:${l.size}`} className="flex justify-between py-3"><span>{l.name} ({l.size}) × {l.quantity}</span><span>{formatPrice(l.price * l.quantity)}</span></li>)}
      </ul>
      <p className="mt-4 text-right text-lg font-semibold">Total {formatPrice(order.totals.total)}</p>
      <div className="mt-8 flex gap-3">
        <Link href="/shop" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">Keep shopping</Link>
        <Link href="/account" className="rounded-full border px-6 py-3 text-sm font-semibold">View orders</Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return <Container className="py-16"><Suspense><Confirmation /></Suspense></Container>;
}
