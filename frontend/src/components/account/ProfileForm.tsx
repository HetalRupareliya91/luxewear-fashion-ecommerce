"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { useToast } from "@/components/common/Toast";
import { FormField } from "@/components/forms/FormField";
import { ApiError } from "@/services/api";
import { updateProfile } from "@/services/account";
import { useAuth } from "@/store/AuthContext";
import { validateProfileForm, type ProfileValues } from "@/utils/accountValidators";
import type { FieldErrors } from "@/utils/validators";

export function ProfileForm() {
  const { user, refresh } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState<ProfileValues>({ firstName: user?.firstName ?? "", lastName: user?.lastName ?? "" });
  const [errors, setErrors] = useState<FieldErrors<keyof ProfileValues>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const found = validateProfileForm(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    try {
      const data = await updateProfile({ firstName: values.firstName.trim(), lastName: values.lastName.trim() });
      refresh(data.user);
      toast.show("Profile saved");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.details) setErrors(error.details as FieldErrors<keyof ProfileValues>);
        setFormError(error.message);
      } else setFormError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <h2 className="text-lg font-semibold">Your details</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First name" name="firstName" autoComplete="given-name" value={values.firstName} error={errors.firstName} onChange={(e) => setValues((v) => ({ ...v, firstName: e.target.value }))} />
        <FormField label="Last name" name="lastName" autoComplete="family-name" value={values.lastName} error={errors.lastName} onChange={(e) => setValues((v) => ({ ...v, lastName: e.target.value }))} />
      </div>
      <FormField label="Email" name="email" value={user?.email ?? ""} disabled readOnly />
      <p className="text-xs text-gray-500">Your email is your sign-in name and cannot be changed here.</p>
      {formError ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</p> : null}
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
    </form>
  );
}
