"use client";

import Link from "next/link";
import { useToast } from "@/components/common/Toast";
import { useAuth } from "@/store/AuthContext";

const PILL = "rounded-full border px-4 py-2 text-sm";

export function AccountMenu() {
  const { user, ready, logout } = useAuth();
  const toast = useToast();

  if (!ready) return <span aria-hidden="true" className={`${PILL} invisible`}>Sign in</span>;
  if (!user) return <Link href="/login" className={PILL}>Sign in</Link>;

  return (
    <div className="flex items-center gap-3">
      <Link href="/account" className={PILL}>Hi, {user.firstName}</Link>
      <button
        type="button"
        className="text-sm underline"
        onClick={async () => {
          await logout();
          toast.show("Signed out");
        }}
      >
        Sign out
      </button>
    </div>
  );
}
