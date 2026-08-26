export function ProductCard({ name, price }: { name: string; price: string }) {
 return <article className="group"><div className="flex aspect-[3/4] items-end rounded-xl bg-gray-100 p-5 transition group-hover:bg-gray-200"><div><h2 className="font-semibold">{name}</h2><p className="mt-2 text-sm text-gray-600">{price}</p></div></div></article>;
}
