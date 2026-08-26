import { ProductCard } from "./ProductCard";
const products = [{name:"Classic Oversized Shirt",price:"$79"},{name:"Minimal Tailored Jacket",price:"$149"},{name:"Relaxed Cotton Trousers",price:"$89"},{name:"Essential Knit Sweater",price:"$99"},{name:"Structured Everyday Coat",price:"$189"},{name:"Soft Ribbed Top",price:"$69"},{name:"Modern Straight Jeans",price:"$109"},{name:"Signature Blazer",price:"$169"}];
export function ProductGrid() { return <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.map(p=><ProductCard key={p.name} {...p}/>)}</div>; }
