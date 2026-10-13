export function StatCard({ title, value, note }: { title: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      {note ? <p className="mt-2 text-sm text-gray-500">{note}</p> : null}
    </div>
  );
}
