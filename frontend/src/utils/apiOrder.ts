import type { PlaceOrderInput } from "@/services/orders";
import type { ShippingMethod } from "@/utils/cartTotals";
import type { CheckoutForm } from "@/utils/validators";

/** Catalogue SKU convention: product id in capitals plus the size, e.g. lw-001 + M -> LW-001-M. */
export const skuFor = (productId: string, size: string): string => `${productId.toUpperCase()}-${size.toUpperCase().replace(/\s+/g, "")}`;

/** Builds the API request from the cart. Prices are not sent: the server looks them up. */
export function toPlaceOrderInput(form: CheckoutForm, method: ShippingMethod, items: { productId: string; size: string; quantity: number }[]): PlaceOrderInput {
  return {
    items: items.map((i) => ({ sku: skuFor(i.productId, i.size), quantity: i.quantity })),
    shippingMethod: method,
    shippingAddress: {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      line1: form.address.trim(),
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim().toUpperCase(),
      phone: form.phone.trim(),
    },
  };
}
