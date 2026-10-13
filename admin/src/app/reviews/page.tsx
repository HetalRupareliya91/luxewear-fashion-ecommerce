import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { adminProducts } from "@/data/products";
import { adminReviews } from "@/data/reviews";
import { formatDate } from "@/lib/format";
import { summarizeRatings } from "@/lib/reviews";

export default function ReviewsPage() {
  const summary = summarizeRatings(adminReviews.map((r) => r.rating));
  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Customer feedback (sample data)." />
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard title="Average rating" value={`${summary.average.toFixed(1)} / 5`} note={`${summary.count} reviews`} />
        <div className="rounded-xl border bg-white p-6 sm:col-span-2">
          <p className="text-sm text-gray-500">Rating breakdown</p>
          <ul className="mt-3 space-y-2 text-sm">
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <li key={star} className="flex items-center gap-3">
                <span className="w-10">{star} ★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><span className="block h-full bg-amber-500" style={{ width: `${summary.count ? (summary.distribution[star] / summary.count) * 100 : 0}%` }} /></span>
                <span className="w-6 text-right text-gray-500">{summary.distribution[star]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul className="space-y-3">
        {adminReviews.map((r) => (
          <li key={r.id} className="rounded-xl border bg-white p-5 text-sm">
            <div className="flex justify-between"><p className="font-medium">{adminProducts.find((p) => p.id === r.productId)?.name}</p><p className="text-amber-600">{"★".repeat(r.rating)}<span className="text-gray-300">{"★".repeat(5 - r.rating)}</span></p></div>
            <p className="mt-2 text-gray-700">{r.comment}</p>
            <p className="mt-2 text-xs text-gray-500">{r.customer} · {formatDate(r.createdAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
