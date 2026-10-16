"use client";

import Link from "next/link";
import { PasswordForm } from "@/components/account/PasswordForm";
import { ProfileForm } from "@/components/account/ProfileForm";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Container } from "@/components/common/Container";

export default function AccountSettingsPage() {
  return (
    <Container className="py-12">
      <Link href="/account" className="text-sm underline">← Back to your account</Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Account settings</h1>
      <RequireAuth>
        <div className="mt-8 grid max-w-3xl gap-12">
          <ProfileForm />
          <PasswordForm />
        </div>
      </RequireAuth>
    </Container>
  );
}
