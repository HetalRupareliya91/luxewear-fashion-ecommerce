import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { siteUrl } from "@/utils/site";

const PAGES = ["", "/shop", "/about", "/faq", "/returns", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${siteUrl}/product/${p.id}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
