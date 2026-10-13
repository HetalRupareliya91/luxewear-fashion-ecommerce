import { PageHeader } from "@/components/ui/PageHeader";

const RULES = [
  ["Free standard shipping from", "$150.00"],
  ["Standard / express / pickup", "$7.99 / $19.99 / Free"],
  ["Sales tax", "8% (applied after discounts, not on shipping)"],
  ["Customer cancellation cut-off", "2 hours before dispatch (CANCEL_CUTOFF_HOURS)"],
  ["Rate limit", "300 API requests per minute per IP"],
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Store rules currently built into the API. Editable settings will arrive with the settings endpoints." />
      <dl className="divide-y rounded-xl border bg-white text-sm">
        {RULES.map(([label, value]) => (
          <div key={label} className="flex flex-wrap justify-between gap-2 px-5 py-4"><dt className="text-gray-500">{label}</dt><dd className="font-medium">{value}</dd></div>
        ))}
      </dl>
    </div>
  );
}
