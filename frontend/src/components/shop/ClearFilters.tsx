"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const FILTER_KEYS = ["category", "sort", "minPrice", "maxPrice", "q"];

export function ClearFilters() {
  const pathname = usePathname();
  const params = useSearchParams();
  if (!FILTER_KEYS.some((k) => params.has(k))) return null;
  return <Link href={pathname} className="text-sm underline">Clear filters</Link>;
}
