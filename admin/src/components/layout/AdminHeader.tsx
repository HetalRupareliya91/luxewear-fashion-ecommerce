"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "./Sidebar";

export function AdminHeader() {
  const pathname = usePathname();
  const title = NAV_ITEMS.find((item) => isActive(pathname, item.href))?.name ?? "Admin";
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500">Admin Panel</p>
        <p className="font-semibold">{title}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">Administrator</p>
          <p className="text-xs text-gray-500">admin@luxewear.com</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">A</div>
      </div>
    </header>
  );
}
