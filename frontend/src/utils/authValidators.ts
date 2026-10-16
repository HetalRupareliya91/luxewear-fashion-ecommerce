import { isEmail, isFilled, type FieldErrors } from "./validators";

export type LoginValues = { email: string; password: string };
export type RegisterValues = { firstName: string; lastName: string; email: string; password: string; confirmPassword: string };

/** Same rule as the API: 8-72 characters with at least one letter and one number. */
export const isStrongPassword = (v: string) => v.length >= 8 && v.length <= 72 && /[A-Za-z]/.test(v) && /\d/.test(v);

export function validateLoginForm(values: LoginValues): FieldErrors<keyof LoginValues> {
  const errors: FieldErrors<keyof LoginValues> = {};
  if (!isEmail(values.email)) errors.email = "Enter a valid email address";
  if (values.password.length === 0) errors.password = "Enter your password";
  return errors;
}

export function validateRegisterForm(values: RegisterValues): FieldErrors<keyof RegisterValues> {
  const errors: FieldErrors<keyof RegisterValues> = {};
  if (!isFilled(values.firstName, 60)) errors.firstName = "First name is required";
  if (values.lastName.trim().length > 60) errors.lastName = "Last name is too long";
  if (!isEmail(values.email)) errors.email = "Enter a valid email address";
  if (!isStrongPassword(values.password)) errors.password = "Use 8-72 characters with at least one letter and one number";
  if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match";
  return errors;
}
