"use client";

import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-20">
      <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">{error.message || "Please try again in a moment."}</p>
        <Button type="button" onClick={() => reset()} className="mt-6">Try again</Button>
      </div>
    </Container>
  );
}
