import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Sign in | LuxeWear" };

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Account</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Sign in</h1>
      <div className="mt-8"><Suspense><AuthForm mode="login" /></Suspense></div>
    </section>
  );
}
