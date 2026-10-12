import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export function FormField({ label, error, id, className = "", ...props }: FormFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="text-sm font-medium">{label}</label>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
        className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black ${error ? "border-red-500" : ""}`}
      />
      {error ? <p id={`${fieldId}-error`} role="alert" className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
