import { StatusBadge, type Tone } from "@/components/ui/StatusBadge";
import type { OrderStatus } from "@/lib/types";

const TONE: Record<OrderStatus, Tone> = { PENDING: "amber", PAID: "blue", PROCESSING: "blue", SHIPPED: "blue", DELIVERED: "green", CANCELLED: "red", REFUNDED: "gray" };

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <StatusBadge label={status[0] + status.slice(1).toLowerCase()} tone={TONE[status]} />;
}
