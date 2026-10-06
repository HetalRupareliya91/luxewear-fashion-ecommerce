import { Container } from "@/components/common/Container";

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

          <form className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
            <input
              aria-label="Email address"
              type="email"
              required
              placeholder="Your email address"
              className="min-w-0 flex-1 rounded-full px-5 py-3 text-black outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
