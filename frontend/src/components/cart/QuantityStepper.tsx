"use client";

type QuantityStepperProps = { value: number; onChange: (next: number) => void; min?: number; max?: number; label?: string };

export function QuantityStepper({ value, onChange, min = 1, max = 10, label = "quantity" }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border text-sm">
      <button type="button" aria-label={`Decrease ${label}`} className="px-3 py-1.5 disabled:opacity-40" disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
      <span className="w-8 text-center" aria-live="polite">{value}</span>
      <button type="button" aria-label={`Increase ${label}`} className="px-3 py-1.5 disabled:opacity-40" disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
