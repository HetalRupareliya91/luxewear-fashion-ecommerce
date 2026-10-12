"use client";

import { FormField } from "@/components/forms/FormField";
import type { CheckoutForm as CheckoutValues, FieldErrors } from "@/utils/validators";

type Props = { values: CheckoutValues; errors: FieldErrors<keyof CheckoutValues>; onChange: (field: keyof CheckoutValues, value: string) => void };

export function CheckoutFields({ values, errors, onChange }: Props) {
  const bind = (field: keyof CheckoutValues) => ({
    name: field,
    value: values[field],
    error: errors[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(field, e.target.value),
  });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Email" type="email" autoComplete="email" className="sm:col-span-2" {...bind("email")} />
      <FormField label="First name" autoComplete="given-name" {...bind("firstName")} />
      <FormField label="Last name" autoComplete="family-name" {...bind("lastName")} />
      <FormField label="Phone" type="tel" autoComplete="tel" className="sm:col-span-2" {...bind("phone")} />
      <FormField label="Street address" autoComplete="street-address" className="sm:col-span-2" {...bind("address")} />
      <FormField label="City" autoComplete="address-level2" {...bind("city")} />
      <FormField label="Postal code" autoComplete="postal-code" {...bind("postalCode")} />
      <div className="sm:col-span-2">
        <label htmlFor="country" className="text-sm font-medium">Country</label>
        <select id="country" value={values.country} onChange={(e) => onChange("country", e.target.value)} className="mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black">
          <option value="US">United States</option>
          <option value="IN">India</option>
          <option value="GB">United Kingdom</option>
        </select>
      </div>
    </div>
  );
}
