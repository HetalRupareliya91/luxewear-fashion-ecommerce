"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { CART_STORAGE_KEY, cartCount, cartReducer, parseStoredCart, type CartItem } from "./cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  ready: boolean;
  add: (item: CartItem) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  remove: (productId: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [ready, setReady] = useState(false);

  // Load once on the client (localStorage does not exist during server rendering)
  useEffect(() => {
    dispatch({ type: "hydrate", items: parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY)) });
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: cartCount(items),
      ready,
      add: (item) => dispatch({ type: "add", item }),
      setQuantity: (productId, size, quantity) => dispatch({ type: "setQuantity", productId, size, quantity }),
      remove: (productId, size) => dispatch({ type: "remove", productId, size }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [items, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
