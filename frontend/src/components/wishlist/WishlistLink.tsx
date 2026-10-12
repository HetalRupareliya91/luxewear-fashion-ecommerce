"use client";

import Link from "next/link";
import { useWishlist } from "@/store/WishlistContext";

export function WishlistLink() {
  const { ids } = useWishlist();
  return (
    <Link href="/wishlist">
      Wishlist
      {ids.length > 0 ? <span className="ml-1.5 rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">{ids.length}</span> : null}
    </Link>
  );
}
