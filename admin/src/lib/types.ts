export type Category = "Women" | "Men" | "Accessories";
export type ProductStatus = "active" | "draft";

export type AdminProduct = { id: string; sku: string; name: string; category: Category; price: number; stock: number; status: ProductStatus };
export type Customer = { id: string; name: string; email: string; city: string; joinedAt: string };

export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
export type OrderItem = { productId: string; quantity: number; unitPrice: number };
export type AdminOrder = { id: string; customerId: string; createdAt: string; status: OrderStatus; items: OrderItem[]; shipping: number };

export type AdminCoupon = {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  active: boolean;
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
};
export type AdminReview = { id: string; productId: string; customer: string; rating: number; comment: string; createdAt: string };
