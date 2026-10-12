"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { WISHLIST_STORAGE_KEY, parseStoredWishlist, toggleWishlist } from "./wishlist";

type WishlistContextValue = { ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void; clear: () => void };

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIds(parseStoredWishlist(window.localStorage.getItem(WISHLIST_STORAGE_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
  }, [ids, ready]);

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, has: (id) => ids.includes(id), toggle: (id) => setIds((current) => toggleWishlist(current, id)), clear: () => setIds([]) }),
    [ids],
  );
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
