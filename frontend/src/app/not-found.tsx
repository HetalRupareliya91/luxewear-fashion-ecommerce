import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";

export default function NotFound() {
  return (
    <Container className="py-20">
      <EmptyState title="Page not found" message="The page you are looking for does not exist or has moved." actionLabel="Back to the shop" actionHref="/shop" />
    </Container>
  );
}
