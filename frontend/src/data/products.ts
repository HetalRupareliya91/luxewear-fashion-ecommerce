export type Product = {
  id: string;
  name: string;
  category: "Women" | "Men" | "Accessories";
  price: number;
  compareAtPrice?: number;
  badge?: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "lw-001",
    name: "Satin Slip Dress",
    category: "Women",
    price: 129,
    compareAtPrice: 159,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "lw-002",
    name: "Tailored Wool Blazer",
    category: "Women",
    price: 189,
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "lw-003",
    name: "Relaxed Linen Shirt",
    category: "Men",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "lw-004",
    name: "Minimal Knit Sweater",
    category: "Men",
    price: 99,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "lw-005",
    name: "Structured Leather Bag",
    category: "Accessories",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "lw-006",
    name: "Classic Straight Denim",
    category: "Women",
    price: 109,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85",
  },
];

export const featuredProducts = products.slice(0, 4);
