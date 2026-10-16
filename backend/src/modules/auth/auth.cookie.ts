import { clearCookie, serializeCookie } from "../../utils/cookies.js";

export const AUTH_COOKIE_NAME = "lw_token";

export type AuthCookieSettings = { maxAgeSeconds: number; secure: boolean; sameSite: "lax" | "strict" | "none" };

/** Set-Cookie value for a fresh login. HttpOnly keeps the token away from page scripts. */
export const authCookie = (token: string, settings: AuthCookieSettings): string =>
  serializeCookie(AUTH_COOKIE_NAME, token, { maxAgeSeconds: settings.maxAgeSeconds, secure: settings.secure, sameSite: settings.sameSite, httpOnly: true });

export const clearAuthCookie = (settings: Pick<AuthCookieSettings, "secure" | "sameSite">): string =>
  clearCookie(AUTH_COOKIE_NAME, { secure: settings.secure, sameSite: settings.sameSite, httpOnly: true });
