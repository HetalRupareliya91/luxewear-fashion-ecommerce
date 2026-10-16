import { apiFetch } from "@/services/api";
import type { ApiOrderStatus } from "@/utils/orderStatus";

export type ApiOrderItem = { sku: string; productId: string; name: string; size: string | null; color: string | null; unitPrice: number; quantity: number };
export type ApiAddress = { firstName: string; lastName: string; line1: string; line2?: string; city: string; state?: string; postalCode: string; country: string; phone?: string };

/** Money fields are whole cents. */
export type ApiOrder = {
  id: string;
  number: string;
  status: ApiOrderStatus;
  items: ApiOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode: string | null;
  shippingMethod: "standard" | "express" | "pickup";
  shippingAddress: ApiAddress;
  createdAt: string;
};

export type PlaceOrderInput = {
  items: { sku: string; quantity: number }[];
  shippingMethod: ApiOrder["shippingMethod"];
  couponCode?: string;
  shippingAddress: ApiAddress;
};

export const placeOrder = (input: PlaceOrderInput) => apiFetch<ApiOrder>("/orders", { method: "POST", json: input });
export const fetchOrders = () => apiFetch<ApiOrder[]>("/orders?limit=50");
export const fetchOrder = (id: string) => apiFetch<ApiOrder>(`/orders/${encodeURIComponent(id)}`);
export const cancelOrder = (id: string) => apiFetch<ApiOrder>(`/orders/${encodeURIComponent(id)}/cancel`, { method: "POST" });
