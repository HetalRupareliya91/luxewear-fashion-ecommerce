"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/store/CartContext";
import { WishlistProvider } from "@/store/WishlistContext";
import { ToastProvider } from "@/components/common/Toast";
import { AuthProvider } from "@/store/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>{children}</AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}
