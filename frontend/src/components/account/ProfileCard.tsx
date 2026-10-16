"use client";

import Link from "next/link";
import { useToast } from "@/components/common/Toast";
import { useAuth } from "@/store/AuthContext";

export function ProfileCard() {
  const { user, ready, logout } = useAuth();
  const toast = useToast();

  if (!ready) return <div className="mt-6 h-24 animate-pulse rounded-2xl bg-gray-100" />;

  if (!user) {
    return (
      <div className="mt-6 rounded-2xl border bg-gray-50 p-5 text-sm">
        <p className="text-gray-700">Sign in to see your profile. Orders placed on this device are listed below.</p>
        <div className="mt-3 flex gap-3">
          <Link href="/login?next=/account" className="rounded-full bg-black px-5 py-2 font-semibold text-white hover:bg-gray-800">Sign in</Link>
          <Link href="/register?next=/account" className="rounded-full border px-5 py-2 font-semibold hover:border-black">Create account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-gray-50 p-5">
      <div>
        <p className="text-lg font-semibold">{user.firstName}{user.lastName ? ` ${user.lastName}` : ""}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
        {user.role === "ADMIN" ? <p className="mt-1 inline-block rounded-full bg-black px-2.5 py-0.5 text-xs font-semibold text-white">Admin</p> : null}
      </div>
      <button type="button" className="rounded-full border px-5 py-2 text-sm font-semibold hover:border-black" onClick={async () => { await logout(); toast.show("Signed out"); }}>
        Sign out
      </button>
    </div>
  );
}
