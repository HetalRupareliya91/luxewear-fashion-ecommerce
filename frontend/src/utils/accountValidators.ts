import { isFilled, type FieldErrors } from "@/utils/validators";

export type ProfileValues = { firstName: string; lastName: string };
export type PasswordValues = { currentPassword: string; newPassword: string; confirmPassword: string };

export function validateProfileForm(v: ProfileValues): FieldErrors<keyof ProfileValues> {
  const errors: FieldErrors<keyof ProfileValues> = {};
  if (!isFilled(v.firstName, 60)) errors.firstName = "First name is required";
  if (v.lastName.trim().length > 60) errors.lastName = "Last name is too long";
  return errors;
}

/** Same rule as the API: 8-72 characters with a letter and a number. */
export const isStrongPassword = (p: string) => p.length >= 8 && p.length <= 72 && /[A-Za-z]/.test(p) && /\d/.test(p);

export function validatePasswordForm(v: PasswordValues): FieldErrors<keyof PasswordValues> {
  const errors: FieldErrors<keyof PasswordValues> = {};
  if (!v.currentPassword) errors.currentPassword = "Enter your current password";
  if (!isStrongPassword(v.newPassword)) errors.newPassword = "Use 8-72 characters with at least one letter and one number";
  else if (v.newPassword === v.currentPassword) errors.newPassword = "Choose a password you have not used just now";
  if (v.confirmPassword !== v.newPassword) errors.confirmPassword = "Passwords do not match";
  return errors;
}
