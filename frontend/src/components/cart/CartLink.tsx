"use client";

import Link from "next/link";
import { useCart } from "@/store/CartContext";

export function CartLink({ onClick }: { onClick?: () => void }) {
  const { count } = useCart();
  return (
    <Link href="/cart" onClick={onClick} aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}>
      Cart
      {count > 0 ? <span className="ml-1.5 rounded-full bg-black px-2 py-0.5 text-xs font-semibold text-white">{count}</span> : null}
    </Link>
  );
}
