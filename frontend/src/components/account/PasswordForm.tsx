"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { useToast } from "@/components/common/Toast";
import { FormField } from "@/components/forms/FormField";
import { ApiError } from "@/services/api";
import { changePassword } from "@/services/account";
import { validatePasswordForm, type PasswordValues } from "@/utils/accountValidators";
import type { FieldErrors } from "@/utils/validators";

const EMPTY: PasswordValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function PasswordForm() {
  const toast = useToast();
  const [values, setValues] = useState<PasswordValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<keyof PasswordValues>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const bind = (field: keyof PasswordValues) => ({
    name: field,
    type: "password" as const,
    value: values[field],
    error: errors[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [field]: e.target.value })),
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const found = validatePasswordForm(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      setValues(EMPTY);
      toast.show("Password changed");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.details) setErrors(error.details as FieldErrors<keyof PasswordValues>);
        setFormError(error.message);
      } else setFormError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <h2 className="text-lg font-semibold">Change password</h2>
      <FormField label="Current password" autoComplete="current-password" {...bind("currentPassword")} />
      <FormField label="New password" autoComplete="new-password" {...bind("newPassword")} />
      <FormField label="Confirm new password" autoComplete="new-password" {...bind("confirmPassword")} />
      {formError ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</p> : null}
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Change password"}</Button>
    </form>
  );
}
