export type ProductDetails = {
  description: string;
  sizes: string[];
  material: string;
  care: string;
  rating: number;
  reviewCount: number;
};

const CLOTHING = ["XS", "S", "M", "L", "XL"];

export const productDetails: Record<string, ProductDetails> = {
  "lw-001": { description: "A fluid satin slip dress with adjustable straps and a bias cut that skims the body.", sizes: CLOTHING, material: "100% recycled polyester satin", care: "Machine wash cold, hang dry.", rating: 4.7, reviewCount: 128 },
  "lw-002": { description: "A sharply tailored blazer in a soft wool blend, lined and structured through the shoulder.", sizes: CLOTHING, material: "70% wool, 30% polyester", care: "Dry clean only.", rating: 4.8, reviewCount: 96 },
  "lw-003": { description: "A breathable relaxed-fit linen shirt that softens with every wash.", sizes: CLOTHING, material: "100% European linen", care: "Machine wash warm, tumble dry low.", rating: 4.5, reviewCount: 74 },
  "lw-004": { description: "A minimal knit sweater with a clean neckline and a soft, brushed hand-feel.", sizes: CLOTHING, material: "60% cotton, 40% merino wool", care: "Hand wash cold, dry flat.", rating: 4.6, reviewCount: 61 },
  "lw-005": { description: "A structured leather bag with a magnetic closure, inner pocket and detachable strap.", sizes: ["One size"], material: "Full-grain leather", care: "Wipe with a soft dry cloth.", rating: 4.9, reviewCount: 142 },
  "lw-006": { description: "Classic straight-leg denim with a mid rise and a comfortable stretch.", sizes: ["28", "30", "32", "34", "36"], material: "98% cotton, 2% elastane", care: "Machine wash cold, inside out.", rating: 4.4, reviewCount: 88 },
};

const fallback: ProductDetails = { description: "A LuxeWear essential.", sizes: ["One size"], material: "See label", care: "Follow the care label.", rating: 0, reviewCount: 0 };

export const getProductDetails = (id: string): ProductDetails => productDetails[id] ?? fallback;
