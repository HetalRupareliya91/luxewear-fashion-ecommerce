import type { Cents } from "../../utils/money.js";
import type { ShippingMethod } from "../shipping/shipping.js";
import type { OrderStatus } from "./order.status.js";

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
};

/** One purchased variant. Name and price are copied so old orders never change when the catalogue does. */
export type OrderLine = {
  sku: string;
  productId: string;
  variantId: string;
  name: string;
  size: string | null;
  color: string | null;
  unitPrice: Cents;
  quantity: number;
};

export type OrderRecord = {
  id: string;
  number: string;
  userId: string | null;
  email: string;
  status: OrderStatus;
  items: OrderLine[];
  subtotal: Cents;
  discount: Cents;
  shipping: Cents;
  tax: Cents;
  total: Cents;
  couponCode: string | null;
  shippingMethod: ShippingMethod;
  shippingAddress: ShippingAddress;
  paymentRef: string | null;
  createdAt: Date;
};

export type NewOrder = Omit<OrderRecord, "id" | "number" | "status" | "paymentRef" | "createdAt">;

/** A sellable variant with its current price and stock. */
export type CatalogVariant = {
  sku: string;
  productId: string;
  variantId: string;
  name: string;
  size: string | null;
  color: string | null;
  unitPrice: Cents;
  stock: number;
};

export type OrderListFilter = { userId?: string; status?: OrderStatus; skip: number; limit: number };

/** Storage the order service needs. Prisma in production, in memory in tests. */
export type OrderRepository = {
  findVariants(skus: string[]): Promise<CatalogVariant[]>;
  /** Stores the order, takes the stock and counts the coupon use in one step. Must throw 409 if stock ran out meanwhile. */
  create(order: NewOrder, now: Date): Promise<OrderRecord>;
  findById(id: string): Promise<OrderRecord | null>;
  findByPaymentRef(reference: string): Promise<OrderRecord | null>;
  /** Newest first. */
  list(filter: OrderListFilter): Promise<{ items: OrderRecord[]; total: number }>;
  /** Saves the status. With restock the items go back on the shelf. */
  updateStatus(id: string, status: OrderStatus, options?: { restock?: boolean }): Promise<OrderRecord>;
  setPaymentRef(id: string, reference: string): Promise<OrderRecord>;
};
