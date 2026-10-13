import type { AdminProduct } from "@/lib/types";

// Sample data until the admin API endpoints exist.
export const adminProducts: AdminProduct[] = [
  { id: "lw-001", sku: "LW-DRS-001", name: "Satin Slip Dress", category: "Women", price: 129, stock: 24, status: "active" },
  { id: "lw-002", sku: "LW-BLZ-002", name: "Tailored Wool Blazer", category: "Women", price: 189, stock: 3, status: "active" },
  { id: "lw-003", sku: "LW-SHT-003", name: "Relaxed Linen Shirt", category: "Men", price: 89, stock: 41, status: "active" },
  { id: "lw-004", sku: "LW-KNT-004", name: "Minimal Knit Sweater", category: "Men", price: 99, stock: 0, status: "active" },
  { id: "lw-005", sku: "LW-BAG-005", name: "Structured Leather Bag", category: "Accessories", price: 149, stock: 12, status: "active" },
  { id: "lw-006", sku: "LW-DNM-006", name: "Classic Straight Denim", category: "Women", price: 109, stock: 8, status: "active" },
  { id: "lw-007", sku: "LW-SCF-007", name: "Merino Scarf", category: "Accessories", price: 49, stock: 60, status: "active" },
  { id: "lw-008", sku: "LW-TRS-008", name: "Linen Trousers", category: "Men", price: 99, stock: 5, status: "draft" },
];
