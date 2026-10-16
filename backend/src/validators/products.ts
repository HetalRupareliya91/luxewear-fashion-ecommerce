import { asBody, isIntBetween, isMissing } from "./helpers.js";
import { isNonEmpty, type ValidationResult } from "./primitives.js";

export const PRODUCT_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
export const PRODUCT_GENDERS = ["MEN", "WOMEN", "UNISEX"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
export type ProductGender = (typeof PRODUCT_GENDERS)[number];

export type VariantInput = { sku: string; size?: string; color?: string; price?: number; stock: number };
export type ImageInput = { url: string; altText?: string };
export type ProductInput = {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  gender: ProductGender;
  status: ProductStatus;
  variants: VariantInput[];
  images: ImageInput[];
};
export type ProductPatch = Partial<Pick<ProductInput, "name" | "description" | "price" | "categoryId" | "gender" | "status">>;

const SKU_RE = /^[A-Za-z0-9._-]{3,40}$/;

/** A price in dollars with at most 2 decimals, e.g. 59 or 59.9 or 59.90. */
export const isPrice = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0 && v <= 100_000 && Math.round(v * 100) / 100 === v;

const isHttpUrl = (v: unknown): v is string => {
  if (typeof v !== "string" || v.length > 500) return false;
  try {
    const url = new URL(v);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

function readVariants(raw: unknown, errors: Record<string, string>): VariantInput[] {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 50) {
    errors.variants = "Add 1 to 50 variants";
    return [];
  }
  const seen = new Set<string>();
  const out: VariantInput[] = [];
  raw.forEach((item, i) => {
    const v = asBody(item);
    const key = `variants.${i}`;
    if (typeof v.sku !== "string" || !SKU_RE.test(v.sku.trim())) errors[`${key}.sku`] = "SKU needs 3-40 letters, numbers, dots, dashes or underscores";
    else if (seen.has(v.sku.trim())) errors[`${key}.sku`] = "Duplicate SKU in this product";
    if (!isIntBetween(v.stock, 0, 1_000_000)) errors[`${key}.stock`] = "Stock must be a whole number of 0 or more";
    if (!isMissing(v.price) && !isPrice(v.price)) errors[`${key}.price`] = "Price must be above 0 with at most 2 decimals";
    if (!isMissing(v.size) && !isNonEmpty(v.size, 20)) errors[`${key}.size`] = "Size is too long";
    if (!isMissing(v.color) && !isNonEmpty(v.color, 30)) errors[`${key}.color`] = "Color is too long";
    if (typeof v.sku === "string") seen.add(v.sku.trim());
    out.push({
      sku: String(v.sku ?? "").trim(),
      stock: v.stock as number,
      ...(isMissing(v.size) ? {} : { size: String(v.size).trim() }),
      ...(isMissing(v.color) ? {} : { color: String(v.color).trim() }),
      ...(isMissing(v.price) ? {} : { price: v.price as number }),
    });
  });
  return out;
}

function readImages(raw: unknown, errors: Record<string, string>): ImageInput[] {
  if (isMissing(raw)) return [];
  if (!Array.isArray(raw) || raw.length > 10) {
    errors.images = "Send up to 10 images";
    return [];
  }
  return raw.map((item, i) => {
    const img = asBody(item);
    if (!isHttpUrl(img.url)) errors[`images.${i}.url`] = "Enter a valid image URL";
    if (!isMissing(img.altText) && !isNonEmpty(img.altText, 200)) errors[`images.${i}.altText`] = "Alt text is too long";
    return { url: String(img.url ?? "").trim(), ...(isMissing(img.altText) ? {} : { altText: String(img.altText).trim() }) };
  });
}

/** Body of POST /admin/products. */
export function validateProduct(input: unknown): ValidationResult<ProductInput> {
  const b = asBody(input);
  const errors: Record<string, string> = {};
  if (!isNonEmpty(b.name, 120)) errors.name = "Name is required (120 characters at most)";
  if (!isMissing(b.description) && !isNonEmpty(b.description, 5000)) errors.description = "Description is too long";
  if (!isPrice(b.price)) errors.price = "Price must be above 0 with at most 2 decimals";
  if (!isNonEmpty(b.categoryId, 64)) errors.categoryId = "Choose a category";
  const gender = isMissing(b.gender) ? "UNISEX" : b.gender;
  if (!PRODUCT_GENDERS.includes(gender as ProductGender)) errors.gender = `Gender must be one of ${PRODUCT_GENDERS.join(", ")}`;
  const status = isMissing(b.status) ? "DRAFT" : b.status;
  if (!PRODUCT_STATUSES.includes(status as ProductStatus)) errors.status = `Status must be one of ${PRODUCT_STATUSES.join(", ")}`;
  const variants = readVariants(b.variants, errors);
  const images = readImages(b.images, errors);
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name: (b.name as string).trim(),
      ...(isMissing(b.description) ? {} : { description: (b.description as string).trim() }),
      price: b.price as number,
      categoryId: (b.categoryId as string).trim(),
      gender: gender as ProductGender,
      status: status as ProductStatus,
      variants,
      images,
    },
  };
}

/** Body of PATCH /admin/products/:id. Variants are changed through the stock endpoint instead. */
export function validateProductPatch(input: unknown): ValidationResult<ProductPatch> {
  const b = asBody(input);
  const errors: Record<string, string> = {};
  const patch: ProductPatch = {};
  if (b.name !== undefined) (isNonEmpty(b.name, 120) ? (patch.name = b.name.trim()) : (errors.name = "Name is required (120 characters at most)"));
  if (b.description !== undefined) (b.description === "" || b.description === null ? (patch.description = "") : isNonEmpty(b.description, 5000) ? (patch.description = b.description.trim()) : (errors.description = "Description is too long"));
  if (b.price !== undefined) (isPrice(b.price) ? (patch.price = b.price) : (errors.price = "Price must be above 0 with at most 2 decimals"));
  if (b.categoryId !== undefined) (isNonEmpty(b.categoryId, 64) ? (patch.categoryId = b.categoryId.trim()) : (errors.categoryId = "Choose a category"));
  if (b.gender !== undefined) (PRODUCT_GENDERS.includes(b.gender as ProductGender) ? (patch.gender = b.gender as ProductGender) : (errors.gender = `Gender must be one of ${PRODUCT_GENDERS.join(", ")}`));
  if (b.status !== undefined) (PRODUCT_STATUSES.includes(b.status as ProductStatus) ? (patch.status = b.status as ProductStatus) : (errors.status = `Status must be one of ${PRODUCT_STATUSES.join(", ")}`));
  if (Object.keys(errors).length) return { ok: false, errors };
  if (Object.keys(patch).length === 0) return { ok: false, errors: { body: "Nothing to change" } };
  return { ok: true, value: patch };
}

/** Body of PATCH /admin/products/variants/:sku/stock. */
export function validateStockChange(input: unknown): ValidationResult<{ stock: number }> {
  const stock = asBody(input).stock;
  return isIntBetween(stock, 0, 1_000_000) ? { ok: true, value: { stock } } : { ok: false, errors: { stock: "Stock must be a whole number of 0 or more" } };
}
