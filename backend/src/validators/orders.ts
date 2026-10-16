import type { ShippingAddress } from "../modules/orders/order.types.js";
import type { ShippingMethod } from "../modules/shipping/shipping.js";
import { normalizeCouponCode, COUPON_CODE_RE } from "./coupons.js";
import { asBody, isIntBetween, isMissing } from "./helpers.js";
import { isNonEmpty, isPhone, isPostalCode, type ValidationResult } from "./primitives.js";

const METHODS: ShippingMethod[] = ["standard", "express", "pickup"];
export const MAX_LINES = 50;
export const MAX_QUANTITY = 20;

export type CartItemInput = { sku: string; quantity: number };
export type QuoteInput = { items: CartItemInput[]; couponCode?: string; shippingMethod: ShippingMethod };
export type CheckoutInput = QuoteInput & { shippingAddress: ShippingAddress };

/** Lines for the same SKU are added together so each SKU appears once. */
function readItems(raw: unknown, errors: Record<string, string>): CartItemInput[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    errors.items = "Add at least one item";
    return [];
  }
  if (raw.length > MAX_LINES) {
    errors.items = `An order can have at most ${MAX_LINES} lines`;
    return [];
  }
  const bySku = new Map<string, number>();
  for (const [i, line] of raw.entries()) {
    const item = asBody(line);
    if (!isNonEmpty(item.sku, 64) || !isIntBetween(item.quantity, 1, MAX_QUANTITY)) {
      errors[`items.${i}`] = `Each item needs a sku and a quantity from 1 to ${MAX_QUANTITY}`;
      continue;
    }
    const sku = item.sku.trim();
    bySku.set(sku, (bySku.get(sku) ?? 0) + item.quantity);
  }
  for (const [sku, quantity] of bySku) if (quantity > MAX_QUANTITY) errors.items = `You can order at most ${MAX_QUANTITY} of ${sku}`;
  return [...bySku].map(([sku, quantity]) => ({ sku, quantity }));
}

function readCommon(body: Record<string, unknown>, errors: Record<string, string>) {
  const items = readItems(body.items, errors);
  const shippingMethod = isMissing(body.shippingMethod) ? "standard" : (body.shippingMethod as ShippingMethod);
  if (!METHODS.includes(shippingMethod)) errors.shippingMethod = "Choose standard, express or pickup";

  let couponCode: string | undefined;
  if (!isMissing(body.couponCode)) {
    couponCode = normalizeCouponCode(body.couponCode);
    if (!COUPON_CODE_RE.test(couponCode)) errors.couponCode = "That coupon code looks wrong";
  }
  return { items, shippingMethod, ...(couponCode ? { couponCode } : {}) };
}

/** Body of POST /checkout/quote. */
export function validateQuote(input: unknown): ValidationResult<QuoteInput> {
  const errors: Record<string, string> = {};
  const value = readCommon(asBody(input), errors);
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

export function validateAddress(input: unknown, errors: Record<string, string>): ShippingAddress {
  const a = asBody(input);
  const need = (key: keyof ShippingAddress, label: string, max = 100) => {
    if (!isNonEmpty(a[key], max)) errors[`shippingAddress.${key}`] = `${label} is required`;
  };
  need("firstName", "First name", 60);
  need("lastName", "Last name", 60);
  need("line1", "Address", 120);
  need("city", "City", 80);

  const country = typeof a.country === "string" ? a.country.trim().toUpperCase() : "";
  if (!/^[A-Z]{2}$/.test(country)) errors["shippingAddress.country"] = "Use a 2-letter country code";

  const postal = typeof a.postalCode === "string" ? a.postalCode.trim() : "";
  const known = ["IN", "US", "GB"].includes(country);
  if (known ? !isPostalCode(postal, country) : !isNonEmpty(postal, 12)) errors["shippingAddress.postalCode"] = "Enter a valid postal code";

  if (!isMissing(a.line2) && !isNonEmpty(a.line2, 120)) errors["shippingAddress.line2"] = "Address line 2 is too long";
  if (!isMissing(a.state) && !isNonEmpty(a.state, 80)) errors["shippingAddress.state"] = "State is too long";
  if (!isMissing(a.phone) && !isPhone(a.phone)) errors["shippingAddress.phone"] = "Enter a valid phone number";

  const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return {
    firstName: text(a.firstName),
    lastName: text(a.lastName),
    line1: text(a.line1),
    ...(isMissing(a.line2) ? {} : { line2: text(a.line2) }),
    city: text(a.city),
    ...(isMissing(a.state) ? {} : { state: text(a.state) }),
    postalCode: postal,
    country,
    ...(isMissing(a.phone) ? {} : { phone: text(a.phone) }),
  };
}

/** Body of POST /orders. */
export function validateCheckout(input: unknown): ValidationResult<CheckoutInput> {
  const body = asBody(input);
  const errors: Record<string, string> = {};
  const common = readCommon(body, errors);
  const shippingAddress = validateAddress(body.shippingAddress, errors);
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: { ...common, shippingAddress } };
}

export const ORDER_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;

/** Body of PATCH /admin/orders/:id/status. */
export function validateStatusChange(input: unknown): ValidationResult<{ status: (typeof ORDER_STATUSES)[number] }> {
  const status = asBody(input).status;
  return ORDER_STATUSES.includes(status as never) ? { ok: true, value: { status: status as (typeof ORDER_STATUSES)[number] } } : { ok: false, errors: { status: `Status must be one of ${ORDER_STATUSES.join(", ")}` } };
}
