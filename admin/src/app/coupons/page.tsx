import { DataTable, type Column } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge, type Tone } from "@/components/ui/StatusBadge";
import { adminCoupons } from "@/data/coupons";
import { couponLabel, couponState, type CouponState } from "@/lib/coupons";
import { formatDate } from "@/lib/format";
import type { AdminCoupon } from "@/lib/types";

const TONE: Record<CouponState, Tone> = { active: "green", expired: "gray", "used up": "amber", inactive: "gray" };

const columns: Column<AdminCoupon>[] = [
  { key: "code", header: "Code", render: (c) => <span className="font-mono font-semibold">{c.code}</span> },
  { key: "discount", header: "Discount", render: (c) => couponLabel(c) },
  { key: "usage", header: "Used", align: "right", render: (c) => (c.usageLimit ? `${c.usedCount} / ${c.usageLimit}` : c.usedCount) },
  { key: "expires", header: "Expires", render: (c) => (c.expiresAt ? formatDate(c.expiresAt) : "Never") },
  { key: "state", header: "Status", render: (c) => { const s = couponState(c); return <StatusBadge label={s[0].toUpperCase() + s.slice(1)} tone={TONE[s]} />; } },
];

export default function CouponsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Coupons" description="Rules are enforced by the API (see backend/src/modules/coupons). Sample data." />
      <DataTable columns={columns} rows={adminCoupons} rowKey={(c) => c.code} />
    </div>
  );
}
