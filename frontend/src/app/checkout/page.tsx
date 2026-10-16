"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckoutFields } from "@/components/checkout/CheckoutForm";
import { ShippingMethodPicker } from "@/components/checkout/ShippingMethodPicker";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { products } from "@/data/products";
import { makeOrderId, saveOrder, type Order } from "@/store/orders";
import { useCart } from "@/store/CartContext";
import { useAuth } from "@/store/AuthContext";
import { calculateTotals, type ShippingMethod } from "@/utils/cartTotals";
import { getProductById } from "@/utils/catalog";
import { EMPTY_CHECKOUT, validateCheckout, type CheckoutForm, type FieldErrors } from "@/utils/validators";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, ready, clear } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState<CheckoutForm>(EMPTY_CHECKOUT);
  const [errors, setErrors] = useState<FieldErrors<keyof CheckoutForm>>({});
  const [method, setMethod] = useState<ShippingMethod>("standard");

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, email: f.email || user.email, firstName: f.firstName || user.firstName, lastName: f.lastName || (user.lastName ?? "") }));
  }, [user]);

  const lines = items.flatMap((item) => {
    const product = getProductById(products, item.productId);
    return product ? [{ item, product }] : [];
  });
  const totals = calculateTotals(lines.map((l) => ({ price: l.product.price, quantity: l.item.quantity })), method);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateCheckout(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const order: Order = {
      id: makeOrderId(),
      placedAt: new Date().toISOString(),
      customer: form,
      shippingMethod: method,
      lines: lines.map(({ item, product }) => ({ productId: product.id, name: product.name, size: item.size, quantity: item.quantity, price: product.price })),
      totals,
    };
    saveOrder(order);
    clear();
    router.push(`/order/success?id=${order.id}`);
  }

  if (!ready) return <Container className="py-16"><p className="text-gray-500">Loading…</p></Container>;
  if (lines.length === 0) return <Container className="py-16"><EmptyState title="Your cart is empty" message="Add something before checking out." actionLabel="Browse the shop" actionHref="/shop" /></Container>;

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-lg font-semibold">Contact and delivery</h2>
            <CheckoutFields values={form} errors={errors} onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))} />
          </section>
          <ShippingMethodPicker value={method} onChange={setMethod} />
          <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Demo checkout: no payment is taken and your order is saved only in this browser.</p>
        </div>
        <aside className="h-fit space-y-6 rounded-2xl border bg-gray-50 p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {lines.map(({ item, product }) => <li key={`${item.productId}:${item.size}`} className="flex justify-between"><span>{product.name} ({item.size}) × {item.quantity}</span></li>)}
          </ul>
          <OrderSummary totals={totals} />
          <Button type="submit" className="w-full">Place order</Button>
          <Link href="/cart" className="block text-center text-sm underline">Back to cart</Link>
        </aside>
      </form>
    </Container>
  );
}
