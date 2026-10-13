"use client";

import { useWishlist } from "@/store/WishlistContext";
import { useToast } from "@/components/common/Toast";

export function WishlistButton({ productId, name, className = "" }: { productId: string; name: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const saved = has(productId);
  return (
    <button
      type="button"
      onClick={() => {
        toggle(productId);
        toast.show(saved ? "Removed from wishlist" : "Saved to wishlist");
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm transition hover:scale-110 ${className}`}
    >
      <span aria-hidden="true" className={saved ? "text-red-500" : "text-gray-500"}>{saved ? "♥" : "♡"}</span>
    </button>
  );
}
