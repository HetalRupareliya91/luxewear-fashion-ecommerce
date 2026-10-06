export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (v: unknown): v is string => typeof v === "string" && v.trim().length <= 254 && EMAIL_RE.test(v.trim());

/** 8-72 characters with at least one letter and one number (72 is bcrypt/scrypt friendly). */
export const isStrongPassword = (v: unknown): v is string =>
  typeof v === "string" && v.length >= 8 && v.length <= 72 && /[A-Za-z]/.test(v) && /\d/.test(v);

/** Optional leading +, then 7-15 digits (spaces, dashes and brackets are ignored). */
export const isPhone = (v: unknown): v is string => {
  if (typeof v !== "string") return false;
  const digits = v.replace(/[\s\-()]/g, "");
  return /^\+?\d{7,15}$/.test(digits);
};

const POSTAL: Record<string, RegExp> = { IN: /^\d{6}$/, US: /^\d{5}(-\d{4})?$/, GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i };

export const isPostalCode = (v: unknown, country: string): v is string =>
  typeof v === "string" && (POSTAL[country.toUpperCase()]?.test(v.trim()) ?? false);

export const isNonEmpty = (v: unknown, max = 100): v is string =>
  typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;
