"use client";

import { useState } from "react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { nextStatuses } from "@/lib/orderStatus";
import type { OrderStatus } from "@/lib/types";

export function OrderStatusControl({ initial }: { initial: OrderStatus }) {
  const [status, setStatus] = useState<OrderStatus>(initial);
  const options = nextStatuses(status);

  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm text-gray-500">Status</p>
      <div className="mt-2"><OrderStatusBadge status={status} /></div>
      {options.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {options.map((next) => (
            <button key={next} type="button" onClick={() => setStatus(next)} className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:border-black">
              Mark as {next.toLowerCase()}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">This order is final.</p>
      )}
      <p className="mt-4 text-xs text-gray-400">Demo only: changes are not saved until the orders API is connected.</p>
    </div>
  );
}
