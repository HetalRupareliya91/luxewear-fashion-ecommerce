import type { OrderStatus } from "./types";

/** Same allowed moves as backend/src/modules/orders/order.status.ts */
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED", "REFUNDED"],
  PROCESSING: ["SHIPPED", "CANCELLED", "REFUNDED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export const ALL_STATUSES = Object.keys(TRANSITIONS) as OrderStatus[];
export const nextStatuses = (from: OrderStatus): OrderStatus[] => TRANSITIONS[from];
export const canTransition = (from: OrderStatus, to: OrderStatus): boolean => TRANSITIONS[from].includes(to);

/** Statuses that count as real revenue. */
export const REVENUE_STATUSES: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
