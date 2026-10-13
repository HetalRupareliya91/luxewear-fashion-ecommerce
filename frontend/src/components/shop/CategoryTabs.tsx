"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { withParams } from "@/utils/query";

const TABS = [
  { label: "All", value: "" },
  { label: "Women", value: "women" },
  { label: "Men", value: "men" },
  { label: "Accessories", value: "accessories" },
];

export function CategoryTabs() {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = (params.get("category") ?? "").toLowerCase();

  return (
    <nav aria-label="Categories" className="flex flex-wrap gap-2">
      {TABS.map((tab) => (
        <Link
          key={tab.label}
          href={`${pathname}${withParams(params, { category: tab.value })}`}
          aria-current={active === tab.value ? "page" : undefined}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${active === tab.value ? "border-black bg-black text-white" : "hover:border-black"}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
