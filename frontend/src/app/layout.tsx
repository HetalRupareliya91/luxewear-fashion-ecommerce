import type { Metadata } from "next";
import "./globals.css";
import { StoreHeader } from "@/components/layout/StoreHeader";
import { StoreFooter } from "@/components/layout/StoreFooter";

export const metadata: Metadata = {
  title: "LuxeWear | Modern Fashion",
  description: "Modern fashion for men and women."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><StoreHeader /><main>{children}</main><StoreFooter /></body></html>;
}
