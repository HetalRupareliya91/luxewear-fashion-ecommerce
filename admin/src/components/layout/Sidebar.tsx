"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_ITEMS = [
  { name: "Dashboard", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "Orders", href: "/orders" },
  { name: "Customers", href: "/customers" },
  { name: "Inventory", href: "/inventory" },
  { name: "Coupons", href: "/coupons" },
  { name: "Reviews", href: "/reviews" },
  { name: "Analytics", href: "/analytics" },
  { name: "Settings", href: "/settings" },
];

export const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white lg:block">
      <div className="border-b px-6 py-5"><Link href="/" className="text-xl font-bold">LuxeWear Admin</Link></div>
      <nav aria-label="Admin" className="p-4">
        {NAV_ITEMS.map(({ name, href }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
            className={`mb-1 block rounded-lg px-4 py-3 text-sm font-medium ${isActive(pathname, href) ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`}
          >
            {name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
