import { HeroSection } from "@/components/home/HeroSection";
import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return <>
    <HeroSection />
    <CollectionShowcase />
    <NewsletterSection />
  </>;
}
