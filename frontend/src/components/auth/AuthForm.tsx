"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { useToast } from "@/components/common/Toast";
import { FormField } from "@/components/forms/FormField";
import { ApiError } from "@/services/api";
import { useAuth } from "@/store/AuthContext";
import { validateLoginForm, validateRegisterForm, type RegisterValues } from "@/utils/authValidators";
import { safeRedirect } from "@/utils/redirect";
import type { FieldErrors } from "@/utils/validators";

const EMPTY: RegisterValues = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const { login, register } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState<RegisterValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<keyof RegisterValues>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";
  const bind = (field: keyof RegisterValues) => ({
    name: field,
    value: values[field],
    error: errors[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [field]: e.target.value })),
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const found = isLogin ? validateLoginForm(values) : validateRegisterForm(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    try {
      const user = isLogin
        ? await login(values.email.trim(), values.password)
        : await register({ email: values.email.trim(), password: values.password, firstName: values.firstName.trim(), ...(values.lastName.trim() ? { lastName: values.lastName.trim() } : {}) });
      toast.show(isLogin ? `Welcome back, ${user.firstName}!` : `Welcome, ${user.firstName}!`);
      router.push(safeRedirect(next));
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.details) setErrors(error.details as FieldErrors<keyof RegisterValues>);
        setFormError(error.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  const otherHref = `${isLogin ? "/register" : "/login"}${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {!isLogin ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="First name" autoComplete="given-name" {...bind("firstName")} />
          <FormField label="Last name (optional)" autoComplete="family-name" {...bind("lastName")} />
        </div>
      ) : null}
      <FormField label="Email" type="email" autoComplete="email" {...bind("email")} />
      <FormField label="Password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} {...bind("password")} />
      {!isLogin ? <FormField label="Confirm password" type="password" autoComplete="new-password" {...bind("confirmPassword")} /> : null}
      {formError ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</p> : null}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait…" : isLogin ? "Sign in" : "Create account"}</Button>
      <p className="text-center text-sm text-gray-600">
        {isLogin ? "New to LuxeWear?" : "Already have an account?"}{" "}
        <Link href={otherHref} className="font-semibold underline">{isLogin ? "Create an account" : "Sign in"}</Link>
      </p>
    </form>
  );
}
