import { AppError } from "../../errors/AppError.js";

export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED", "REFUNDED"],
  PROCESSING: ["SHIPPED", "CANCELLED", "REFUNDED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export const nextStatuses = (from: OrderStatus): OrderStatus[] => TRANSITIONS[from];
export const canTransition = (from: OrderStatus, to: OrderStatus): boolean => TRANSITIONS[from].includes(to);

/** Returns `to` or throws a 409 explaining which moves are allowed. */
export function assertTransition(from: OrderStatus, to: OrderStatus): OrderStatus {
  if (!canTransition(from, to)) {
    const allowed = nextStatuses(from).join(", ") || "none";
    throw AppError.conflict(`Cannot change an order from ${from} to ${to}. Allowed: ${allowed}`);
  }
  return to;
}

export const isFinal = (status: OrderStatus): boolean => TRANSITIONS[status].length === 0;
