import { Container } from "@/components/common/Container";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="bg-black py-20 text-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
            LuxeWear Journal
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Style notes, new drops and private offers.
          </h2>

          <p className="mt-4 text-gray-400">
            Join our list for early access to collections and seasonal edits.
          </p>

          <NewsletterForm />
        </div>
      </Container>
    </section>
  );
}
