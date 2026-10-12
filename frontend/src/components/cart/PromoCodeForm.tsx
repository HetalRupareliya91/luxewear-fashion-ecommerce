"use client";

import { useState } from "react";
import { findCoupon } from "@/data/coupons";

type Props = { applied: { code: string; percent: number } | null; onApply: (coupon: { code: string; percent: number } | null) => void };

export function PromoCodeForm({ applied, onApply }: Props) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const coupon = findCoupon(code);
    if (!coupon) {
      setMessage("That code is not valid");
      return;
    }
    onApply({ code: coupon.code, percent: coupon.percent });
    setMessage("");
    setCode("");
  }

  if (applied) {
    return (
      <p className="flex items-center justify-between text-sm">
        <span>Code <strong>{applied.code}</strong> applied ({applied.percent}% off)</span>
        <button type="button" className="underline" onClick={() => onApply(null)}>Remove</button>
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="promo" className="text-sm font-medium">Promo code</label>
      <div className="mt-2 flex gap-2">
        <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="WELCOME10" className="min-w-0 flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:border-black" />
        <button type="submit" className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white">Apply</button>
      </div>
      {message ? <p role="alert" className="mt-2 text-sm text-red-600">{message}</p> : null}
    </form>
  );
}
