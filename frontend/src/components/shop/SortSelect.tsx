"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/utils/catalog";
import { withParams } from "@/utils/query";

export function SortSelect() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Sort by</span>
      <select
        value={params.get("sort") ?? "featured"}
        onChange={(e) => router.replace(`${pathname}${withParams(params, { sort: e.target.value === "featured" ? "" : e.target.value })}`)}
        className="rounded-full border px-4 py-2 outline-none focus:border-black"
      >
        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
