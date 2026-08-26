import Link from "next/link";
import { Container } from "@/components/common/Container";

export function StoreFooter() {
  return <footer className="border-t bg-gray-50"><Container>
    <div className="grid gap-10 py-12 md:grid-cols-4">
      <div><h2 className="text-xl font-bold">LuxeWear</h2><p className="mt-3 text-sm leading-6 text-gray-600">Modern fashion designed for everyday confidence and timeless style.</p></div>
      <div><h3 className="font-semibold">Shop</h3><div className="mt-4 flex flex-col gap-3 text-sm text-gray-600"><Link href="/shop">All Products</Link><Link href="/shop?category=men">Men</Link><Link href="/shop?category=women">Women</Link></div></div>
      <div><h3 className="font-semibold">Customer Care</h3><div className="mt-4 flex flex-col gap-3 text-sm text-gray-600"><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link><Link href="/returns">Returns</Link></div></div>
      <div><h3 className="font-semibold">Company</h3><div className="mt-4 flex flex-col gap-3 text-sm text-gray-600"><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
    </div>
    <div className="border-t py-6 text-center text-sm text-gray-500">© 2026 LuxeWear. All rights reserved.</div>
  </Container></footer>;
}
