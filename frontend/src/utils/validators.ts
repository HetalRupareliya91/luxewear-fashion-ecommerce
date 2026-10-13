export type FieldErrors<K extends string = string> = Partial<Record<K, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL: Record<string, RegExp> = { US: /^\d{5}(-\d{4})?$/, IN: /^\d{6}$/, GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i };

export const isEmail = (v: string) => v.trim().length <= 254 && EMAIL_RE.test(v.trim());
export const isPhone = (v: string) => /^\+?\d{7,15}$/.test(v.replace(/[\s\-()]/g, ""));
export const isPostalCode = (v: string, country: string) => POSTAL[country.toUpperCase()]?.test(v.trim()) ?? false;
export const isFilled = (v: string, max = 100) => v.trim().length > 0 && v.trim().length <= max;

export type CheckoutForm = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export const EMPTY_CHECKOUT: CheckoutForm = { email: "", firstName: "", lastName: "", phone: "", address: "", city: "", postalCode: "", country: "US" };

export function validateCheckout(form: CheckoutForm): FieldErrors<keyof CheckoutForm> {
  const errors: FieldErrors<keyof CheckoutForm> = {};
  if (!isEmail(form.email)) errors.email = "Enter a valid email address";
  if (!isFilled(form.firstName, 60)) errors.firstName = "First name is required";
  if (!isFilled(form.lastName, 60)) errors.lastName = "Last name is required";
  if (!isPhone(form.phone)) errors.phone = "Enter a phone number with 7-15 digits";
  if (!isFilled(form.address, 200)) errors.address = "Street address is required";
  if (!isFilled(form.city, 80)) errors.city = "City is required";
  if (!isPostalCode(form.postalCode, form.country)) errors.postalCode = "Enter a valid postal code for the selected country";
  return errors;
}
