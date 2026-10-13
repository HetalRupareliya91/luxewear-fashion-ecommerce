"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { useToast } from "@/components/common/Toast";
import { MAX_QUANTITY } from "@/store/cart";
import { useCart } from "@/store/CartContext";

export function ProductPurchase({ productId, sizes }: { productId: string; sizes: string[] }) {
  const { add } = useCart();
  const toast = useToast();
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  function handleAdd() {
    if (!size) {
      setError("Please choose a size");
      return;
    }
    setError("");
    add({ productId, size, quantity });
    toast.show("Added to your cart");
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="mt-8">
      <p className="text-sm font-semibold">Size</p>
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={size === s}
            onClick={() => {
              setSize(s);
              setError("");
            }}
            className={`min-w-12 rounded-full border px-4 py-2 text-sm font-medium transition ${size === s ? "border-black bg-black text-white" : "hover:border-black"}`}
          >
            {s}
          </button>
        ))}
      </div>
      {error ? <p role="alert" className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center rounded-full border">
          <button type="button" aria-label="Decrease quantity" className="px-4 py-2" disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)}>−</button>
          <span className="w-8 text-center text-sm" aria-live="polite">{quantity}</span>
          <button type="button" aria-label="Increase quantity" className="px-4 py-2" disabled={quantity >= MAX_QUANTITY} onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
        <Button type="button" onClick={handleAdd} className="flex-1">Add to cart</Button>
      </div>

      {added ? (
        <p role="status" className="mt-4 text-sm text-green-700">
          Added to your cart. <Link href="/cart" className="font-semibold underline">View cart</Link>
        </p>
      ) : null}
    </div>
  );
}
