const TONES = {
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-gray-100 text-gray-700",
} as const;

export type Tone = keyof typeof TONES;

export function StatusBadge({ label, tone = "gray" }: { label: string; tone?: Tone }) {
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${TONES[tone]}`}>{label}</span>;
}
