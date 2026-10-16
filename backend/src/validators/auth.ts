import { isEmail, isNonEmpty, isStrongPassword, type ValidationResult } from "./primitives.js";

type Body = Record<string, unknown>;
const asBody = (v: unknown): Body => (v && typeof v === "object" ? (v as Body) : {});

export type RegisterInput = { email: string; password: string; firstName: string; lastName?: string };
export type LoginInput = { email: string; password: string };

export type ProfileInput = { firstName?: string; lastName?: string | null };
export type PasswordChangeInput = { currentPassword: string; newPassword: string };

/** Only names can be changed here; an email or role in the body is ignored. An empty last name clears it. */
export function validateProfileUpdate(input: unknown): ValidationResult<ProfileInput> {
  const body = asBody(input);
  const errors: Record<string, string> = {};
  const value: ProfileInput = {};
  if (body.firstName !== undefined) {
    if (isNonEmpty(body.firstName, 60)) value.firstName = body.firstName.trim();
    else errors.firstName = "First name is required";
  }
  if (body.lastName !== undefined) {
    if (body.lastName === null || body.lastName === "") value.lastName = null;
    else if (isNonEmpty(body.lastName, 60)) value.lastName = body.lastName.trim();
    else errors.lastName = "Last name is too long";
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  if (Object.keys(value).length === 0) return { ok: false, errors: { body: "Nothing to change" } };
  return { ok: true, value };
}

export function validateChangePassword(input: unknown): ValidationResult<PasswordChangeInput> {
  const body = asBody(input);
  const errors: Record<string, string> = {};
  if (typeof body.currentPassword !== "string" || body.currentPassword.length === 0) errors.currentPassword = "Enter your current password";
  if (!isStrongPassword(body.newPassword)) errors.newPassword = "Use 8-72 characters with at least one letter and one number";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { currentPassword: body.currentPassword as string, newPassword: body.newPassword as string } };
}

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
