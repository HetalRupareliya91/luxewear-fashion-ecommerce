import { formatPrice } from "@/utils/format";

/** The API stores money as whole cents; the storefront shows dollars. */
export const formatCents = (cents: number): string => formatPrice(cents / 100);
