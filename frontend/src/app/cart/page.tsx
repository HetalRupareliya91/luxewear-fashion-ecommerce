"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { PromoCodeForm } from "@/components/cart/PromoCodeForm";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { products } from "@/data/products";
import { useCart } from "@/store/CartContext";
import { calculateTotals } from "@/utils/cartTotals";
import { getProductById } from "@/utils/catalog";

export default function CartPage() {
  const { items, ready, setQuantity, remove } = useCart();
  const [coupon, setCoupon] = useState<{ code: string; percent: number } | null>(null);

  const lines = useMemo(
    () => items.flatMap((item) => {
      const product = getProductById(products, item.productId);
      return product ? [{ item, product }] : [];
    }),
    [items],
  );
  const totals = calculateTotals(lines.map((l) => ({ price: l.product.price, quantity: l.item.quantity })), "standard", coupon?.percent ?? 0);

  if (!ready) return <Container className="py-16"><p className="text-gray-500">Loading your cart…</p></Container>;

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>
      {lines.length === 0 ? (
        <div className="mt-8"><EmptyState title="Your cart is empty" message="Browse the collection and add something you love." actionLabel="Continue shopping" actionHref="/shop" /></div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y border-y">
            {lines.map(({ item, product }) => (
              <CartItemRow key={`${item.productId}:${item.size}`} item={item} product={product} onQuantity={(q) => setQuantity(item.productId, item.size, q)} onRemove={() => remove(item.productId, item.size)} />
            ))}
          </ul>
          <aside className="h-fit space-y-6 rounded-2xl border bg-gray-50 p-6">
            <FreeShippingBar subtotal={totals.subtotal - totals.discount} />
            <PromoCodeForm applied={coupon} onApply={setCoupon} />
            <OrderSummary totals={totals} />
            <Link href="/checkout" className="block rounded-full bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:bg-gray-800">Checkout</Link>
            <Link href="/shop" className="block text-center text-sm underline">Continue shopping</Link>
          </aside>
        </div>
      )}
    </Container>
  );
}
