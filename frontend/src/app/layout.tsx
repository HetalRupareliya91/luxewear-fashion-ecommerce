import type { Metadata } from "next";
import "./globals.css";
import { StoreHeader } from "@/components/layout/StoreHeader";
import { StoreFooter } from "@/components/layout/StoreFooter";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: "LuxeWear | Modern Fashion",
  description: "Modern fashion for men and women."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Providers><StoreHeader /><main>{children}</main><StoreFooter /></Providers></body></html>;
}
