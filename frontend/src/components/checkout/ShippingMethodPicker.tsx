"use client";

import { SHIPPING_RATES, type ShippingMethod } from "@/utils/cartTotals";
import { formatPrice } from "@/utils/format";

const OPTIONS: { value: ShippingMethod; label: string; note: string }[] = [
  { value: "standard", label: "Standard", note: "3-5 business days" },
  { value: "express", label: "Express", note: "1-2 business days" },
  { value: "pickup", label: "Store pickup", note: "Ready in 24 hours" },
];

export function ShippingMethodPicker({ value, onChange }: { value: ShippingMethod; onChange: (m: ShippingMethod) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">Shipping method</legend>
      <div className="mt-3 space-y-3">
        {OPTIONS.map((o) => (
          <label key={o.value} className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm ${value === o.value ? "border-black bg-gray-50" : ""}`}>
            <span className="flex items-center gap-3">
              <input type="radio" name="shippingMethod" value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
              <span><span className="font-semibold">{o.label}</span> <span className="text-gray-500">· {o.note}</span></span>
            </span>
            <span>{SHIPPING_RATES[o.value] === 0 ? "Free" : formatPrice(SHIPPING_RATES[o.value])}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
