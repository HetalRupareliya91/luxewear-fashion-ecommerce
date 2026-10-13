"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { withParams } from "@/utils/query";

export function PriceFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [min, setMin] = useState(params.get("minPrice") ?? "");
  const [max, setMax] = useState(params.get("maxPrice") ?? "");

  function apply(e: React.FormEvent) {
    e.preventDefault();
    router.replace(`${pathname}${withParams(params, { minPrice: min, maxPrice: max })}`);
  }

  const field = "w-24 rounded-full border px-4 py-2 text-sm outline-none focus:border-black";
  return (
    <form onSubmit={apply} className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Price</span>
      <input type="number" min={0} inputMode="numeric" aria-label="Minimum price" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} className={field} />
      <span aria-hidden="true">–</span>
      <input type="number" min={0} inputMode="numeric" aria-label="Maximum price" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} className={field} />
      <button type="submit" className="rounded-full border border-black px-4 py-2 font-semibold hover:bg-black hover:text-white">Apply</button>
    </form>
  );
}
