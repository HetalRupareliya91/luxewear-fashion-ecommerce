import type { Totals } from "@/utils/cartTotals";
import { formatPrice } from "@/utils/format";

export function OrderSummary({ totals, shippingLabel }: { totals: Totals; shippingLabel?: string }) {
  const row = (label: string, value: string, strong = false) => (
    <div className={`flex justify-between ${strong ? "border-t pt-4 text-base font-semibold" : "text-sm text-gray-600"}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
  return (
    <dl className="space-y-3">
      {row("Subtotal", formatPrice(totals.subtotal))}
      {totals.discount > 0 ? row("Discount", `−${formatPrice(totals.discount)}`) : null}
      {row(shippingLabel ?? "Shipping", totals.shipping === 0 ? "Free" : formatPrice(totals.shipping))}
      {row("Estimated tax", formatPrice(totals.tax))}
      {row("Total", formatPrice(totals.total), true)}
    </dl>
  );
}
