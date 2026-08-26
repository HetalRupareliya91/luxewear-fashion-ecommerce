"use client";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/common/Container";

const links = [
  ["Home","/"],["Shop","/shop"],["Men","/shop?category=men"],["Women","/shop?category=women"],["New Arrivals","/shop?sort=newest"],["About","/about"]
];

export function StoreHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
    <Container><div className="flex h-16 items-center justify-between">
      <Link href="/" className="text-2xl font-bold tracking-tight">LuxeWear</Link>
      <nav className="hidden items-center gap-7 md:flex">{links.map(([label,href])=><Link key={href} href={href} className="text-sm font-medium text-gray-700 hover:text-black">{label}</Link>)}</nav>
      <div className="hidden items-center gap-4 md:flex"><Link href="/search">Search</Link><Link href="/wishlist">Wishlist</Link><Link href="/cart">Cart</Link><Link href="/account" className="rounded-full border px-4 py-2 text-sm">Account</Link></div>
      <button className="rounded border px-3 py-2 md:hidden" onClick={()=>setOpen(!open)}>Menu</button>
    </div>
    {open && <nav className="border-t py-4 md:hidden"><div className="flex flex-col gap-4">{links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}<Link href="/cart">Cart</Link><Link href="/account">Account</Link></div></nav>}
    </Container>
  </header>;
}
