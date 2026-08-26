import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CollectionShowcase />
      <FeaturedProducts />
      <NewsletterSection />
    </>
  );
}
