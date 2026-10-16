/** Sample catalogue that matches the storefront's built-in products, so signed-in checkout works out of the box. */
export type SeedProduct = {
  key: string;
  name: string;
  category: "Women" | "Men" | "Accessories";
  gender: "MEN" | "WOMEN" | "UNISEX";
  price: number;
  description: string;
  image: string;
  sizes: string[];
  stockPerSize: number;
};

const CLOTHING = ["XS", "S", "M", "L", "XL"];

export const SEED_PRODUCTS: SeedProduct[] = [
  { key: "lw-001", name: "Satin Slip Dress", category: "Women", gender: "WOMEN", price: 129, description: "A fluid satin slip dress with adjustable straps and a bias cut that skims the body.", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=85", sizes: CLOTHING, stockPerSize: 12 },
  { key: "lw-002", name: "Tailored Wool Blazer", category: "Women", gender: "WOMEN", price: 189, description: "A sharply tailored blazer in a soft wool blend, lined and structured through the shoulder.", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85", sizes: CLOTHING, stockPerSize: 8 },
  { key: "lw-003", name: "Relaxed Linen Shirt", category: "Men", gender: "MEN", price: 89, description: "A breathable relaxed-fit linen shirt that softens with every wash.", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85", sizes: CLOTHING, stockPerSize: 15 },
  { key: "lw-004", name: "Minimal Knit Sweater", category: "Men", gender: "MEN", price: 99, description: "A minimal knit sweater with a clean neckline and a soft, brushed hand-feel.", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85", sizes: CLOTHING, stockPerSize: 10 },
  { key: "lw-005", name: "Structured Leather Bag", category: "Accessories", gender: "UNISEX", price: 149, description: "A structured leather bag with a magnetic closure, inner pocket and detachable strap.", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85", sizes: ["One size"], stockPerSize: 25 },
  { key: "lw-006", name: "Classic Straight Denim", category: "Women", gender: "WOMEN", price: 109, description: "Classic straight-leg denim with a mid rise and a comfortable stretch.", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85", sizes: ["28", "30", "32", "34", "36"], stockPerSize: 9 },
];

/** lw-001 + "M" -> LW-001-M. The storefront builds the same SKU when it places an order. */
export const skuFor = (key: string, size: string): string => `${key.toUpperCase()}-${size.toUpperCase().replace(/\s+/g, "")}`;

export const SEED_COUPONS = [
  { code: "WELCOME10", type: "PERCENT" as const, value: 10, active: true },
  { code: "SAVE20", type: "FIXED" as const, value: 2000, active: true, minSubtotal: 10000 },
];
