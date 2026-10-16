import test from "node:test";
import assert from "node:assert/strict";
import { AUTH_COOKIE_NAME, authCookie, clearAuthCookie } from "../src/modules/auth/auth.cookie.js";

const settings = { maxAgeSeconds: 3600, secure: false, sameSite: "lax" as const };

test("login cookie is HttpOnly, scoped to / and expires with the token", () => {
  const value = authCookie("abc.def", settings);
  assert.ok(value.startsWith(`${AUTH_COOKIE_NAME}=abc.def;`));
  for (const part of ["Path=/", "Max-Age=3600", "HttpOnly", "SameSite=Lax"]) assert.ok(value.includes(part), part);
  assert.ok(!value.includes("Secure"));
});

test("secure and sameSite settings are respected", () => {
  const value = authCookie("t", { maxAgeSeconds: 60, secure: true, sameSite: "none" });
  assert.ok(value.includes("Secure") && value.includes("SameSite=None"));
});

test("clearing removes the cookie right away", () => {
  const value = clearAuthCookie(settings);
  assert.ok(value.startsWith(`${AUTH_COOKIE_NAME}=;`) && value.includes("Max-Age=0"));
});
