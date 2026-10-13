import { formatMoney } from "@/lib/format";

export type ChartPoint = { label: string; value: number };

/** Dependency-free SVG bar chart. */
export function SalesChart({ data, height = 260 }: { data: ChartPoint[]; height?: number }) {
  if (data.length === 0) return <div className="flex h-60 items-center justify-center text-sm text-gray-500">No sales yet.</div>;

  const width = 640;
  const pad = { top: 16, right: 12, bottom: 32, left: 12 };
  const max = Math.max(...data.map((d) => d.value), 1);
  const slot = (width - pad.left - pad.right) / data.length;
  const barWidth = Math.min(slot * 0.6, 48);
  const plotHeight = height - pad.top - pad.bottom;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Revenue by day, highest ${formatMoney(max)}`} className="mt-4 w-full">
      <line x1={pad.left} x2={width - pad.right} y1={height - pad.bottom} y2={height - pad.bottom} stroke="#e5e7eb" />
      {data.map((d, i) => {
        const h = (d.value / max) * plotHeight;
        const x = pad.left + slot * i + (slot - barWidth) / 2;
        return (
          <g key={d.label}>
            <rect x={x} y={height - pad.bottom - h} width={barWidth} height={h} rx={4} fill="#111827">
              <title>{`${d.label}: ${formatMoney(d.value)}`}</title>
            </rect>
            <text x={x + barWidth / 2} y={height - pad.bottom - h - 6} textAnchor="middle" fontSize="11" fill="#374151">{Math.round(d.value)}</text>
            <text x={x + barWidth / 2} y={height - 10} textAnchor="middle" fontSize="11" fill="#6b7280">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
