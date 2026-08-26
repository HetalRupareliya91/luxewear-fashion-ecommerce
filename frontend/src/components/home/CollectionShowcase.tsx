import Link from "next/link";
import { Container } from "@/components/common/Container";
const items = [{name:"Women",href:"/shop?category=women",text:"Contemporary styles for every moment."},{name:"Men",href:"/shop?category=men",text:"Modern essentials and wardrobe staples."},{name:"New Arrivals",href:"/shop?sort=newest",text:"Fresh styles just added."}];
export function CollectionShowcase() {
 return <section className="py-20"><Container><div className="text-center"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Explore</p><h2 className="mt-3 text-3xl font-bold">Shop by Collection</h2></div><div className="mt-12 grid gap-6 md:grid-cols-3">{items.map(i=><Link key={i.name} href={i.href} className="rounded-2xl bg-gray-100 p-6 hover:bg-gray-200"><div className="flex h-64 items-end rounded-xl bg-gray-200 p-6"><div><h3 className="text-2xl font-semibold">{i.name}</h3><p className="mt-2 text-sm text-gray-600">{i.text}</p></div></div></Link>)}</div></Container></section>;
}
