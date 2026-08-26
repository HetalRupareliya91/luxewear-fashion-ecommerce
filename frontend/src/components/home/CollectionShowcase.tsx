import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";

const collections = [
  {
    name: "Women",
    href: "/shop?category=women",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85",
    description: "Contemporary silhouettes for every moment.",
  },
  {
    name: "Men",
    href: "/shop?category=men",
    image:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1000&q=85",
    description: "Modern essentials and refined wardrobe staples.",
  },
  {
    name: "Accessories",
    href: "/shop?category=accessories",
    image:
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1000&q=85",
    description: "Finishing touches that complete the look.",
  },
];

export function CollectionShowcase() {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            Explore
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Shop by Collection
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.name}
              href={collection.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 pt-24 text-white">
                <h3 className="text-2xl font-semibold">{collection.name}</h3>
                <p className="mt-2 text-sm text-white/80">
                  {collection.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
