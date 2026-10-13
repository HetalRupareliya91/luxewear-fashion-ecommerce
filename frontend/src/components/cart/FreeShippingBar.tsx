import { FREE_SHIPPING_THRESHOLD, amountToFreeShipping } from "@/utils/cartTotals";
import { formatPrice } from "@/utils/format";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = amountToFreeShipping(subtotal);
  const percent = Math.min(Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100), 100);
  return (
    <div>
      <p className="text-sm">
        {remaining > 0 ? <>Add <strong>{formatPrice(remaining)}</strong> more for free standard shipping</> : "You have unlocked free standard shipping"}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="h-full rounded-full bg-black transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
