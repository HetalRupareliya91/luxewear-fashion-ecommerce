import type { AdminOrder } from "@/lib/types";

export const adminOrders: AdminOrder[] = [
  { id: "LW-1021", customerId: "c-01", createdAt: "2026-10-01T09:20:00Z", status: "DELIVERED", shipping: 0, items: [{ productId: "lw-001", quantity: 1, unitPrice: 129 }, { productId: "lw-007", quantity: 1, unitPrice: 49 }] },
  { id: "LW-1022", customerId: "c-02", createdAt: "2026-10-01T15:05:00Z", status: "DELIVERED", shipping: 7.99, items: [{ productId: "lw-003", quantity: 1, unitPrice: 89 }] },
  { id: "LW-1023", customerId: "c-03", createdAt: "2026-10-02T11:40:00Z", status: "SHIPPED", shipping: 0, items: [{ productId: "lw-002", quantity: 1, unitPrice: 189 }] },
  { id: "LW-1024", customerId: "c-01", createdAt: "2026-10-03T08:15:00Z", status: "DELIVERED", shipping: 0, items: [{ productId: "lw-005", quantity: 1, unitPrice: 149 }, { productId: "lw-004", quantity: 1, unitPrice: 99 }] },
  { id: "LW-1025", customerId: "c-04", createdAt: "2026-10-04T13:55:00Z", status: "PROCESSING", shipping: 7.99, items: [{ productId: "lw-007", quantity: 2, unitPrice: 49 }] },
  { id: "LW-1026", customerId: "c-05", createdAt: "2026-10-05T17:30:00Z", status: "CANCELLED", shipping: 7.99, items: [{ productId: "lw-006", quantity: 1, unitPrice: 109 }] },
  { id: "LW-1027", customerId: "c-02", createdAt: "2026-10-06T10:10:00Z", status: "PAID", shipping: 0, items: [{ productId: "lw-001", quantity: 2, unitPrice: 129 }] },
  { id: "LW-1028", customerId: "c-06", createdAt: "2026-10-07T12:45:00Z", status: "PAID", shipping: 7.99, items: [{ productId: "lw-003", quantity: 1, unitPrice: 89 }] },
  { id: "LW-1029", customerId: "c-03", createdAt: "2026-10-08T09:00:00Z", status: "PENDING", shipping: 0, items: [{ productId: "lw-002", quantity: 1, unitPrice: 189 }, { productId: "lw-006", quantity: 1, unitPrice: 109 }] },
  { id: "LW-1030", customerId: "c-04", createdAt: "2026-10-08T18:20:00Z", status: "REFUNDED", shipping: 0, items: [{ productId: "lw-005", quantity: 1, unitPrice: 149 }] },
  { id: "LW-1031", customerId: "c-01", createdAt: "2026-10-09T07:35:00Z", status: "PROCESSING", shipping: 0, items: [{ productId: "lw-001", quantity: 1, unitPrice: 129 }, { productId: "lw-003", quantity: 2, unitPrice: 89 }] },
  { id: "LW-1032", customerId: "c-05", createdAt: "2026-10-09T16:50:00Z", status: "PAID", shipping: 7.99, items: [{ productId: "lw-007", quantity: 1, unitPrice: 49 }] },
];
