"use client";

import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/data/products";
import { useWishlist } from "@/store/WishlistContext";

export default function WishlistPage() {
  const { ids, clear } = useWishlist();
  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <Container className="py-12">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your wishlist</h1>
        {saved.length > 0 ? <button type="button" onClick={clear} className="text-sm underline">Clear all</button> : null}
      </div>
      <div className="mt-8">
        {saved.length === 0 ? <EmptyState title="Nothing saved yet" message="Tap the heart on any product to keep it here." actionLabel="Browse the shop" actionHref="/shop" /> : <ProductGrid items={saved} />}
      </div>
    </Container>
  );
}
