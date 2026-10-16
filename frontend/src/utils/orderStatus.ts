export type ApiOrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export const STATUS_LABEL: Record<ApiOrderStatus, string> = {
  PENDING: "Awaiting payment",
  PAID: "Paid",
  PROCESSING: "Being prepared",
  SHIPPED: "On its way",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const STATUS_STYLE: Record<ApiOrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  PAID: "bg-blue-100 text-blue-900",
  PROCESSING: "bg-blue-100 text-blue-900",
  SHIPPED: "bg-indigo-100 text-indigo-900",
  DELIVERED: "bg-green-100 text-green-900",
  CANCELLED: "bg-gray-200 text-gray-700",
  REFUNDED: "bg-gray-200 text-gray-700",
};

/** Customers can only cancel before they pay. */
export const canCustomerCancel = (status: ApiOrderStatus): boolean => status === "PENDING";
