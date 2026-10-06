import { isEmail, isNonEmpty, isStrongPassword, type ValidationResult } from "./primitives.js";

type Body = Record<string, unknown>;
const asBody = (v: unknown): Body => (v && typeof v === "object" ? (v as Body) : {});

export type RegisterInput = { email: string; password: string; firstName: string; lastName?: string };
export type LoginInput = { email: string; password: string };

export function validateRegister(input: unknown): ValidationResult<RegisterInput> {
  const body = asBody(input);
  const errors: Record<string, string> = {};
  if (!isEmail(body.email)) errors.email = "Enter a valid email address";
  if (!isStrongPassword(body.password)) errors.password = "Use 8-72 characters with at least one letter and one number";
  if (!isNonEmpty(body.firstName, 60)) errors.firstName = "First name is required";
  if (body.lastName !== undefined && body.lastName !== "" && !isNonEmpty(body.lastName, 60)) errors.lastName = "Last name is too long";
  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      email: (body.email as string).trim().toLowerCase(),
      password: body.password as string,
      firstName: (body.firstName as string).trim(),
      ...(body.lastName ? { lastName: (body.lastName as string).trim() } : {}),
    },
  };
}

export function validateLogin(input: unknown): ValidationResult<LoginInput> {
  const body = asBody(input);
  const errors: Record<string, string> = {};
  if (!isEmail(body.email)) errors.email = "Enter a valid email address";
  if (typeof body.password !== "string" || body.password.length === 0) errors.password = "Password is required";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { email: (body.email as string).trim().toLowerCase(), password: body.password as string } };
}
