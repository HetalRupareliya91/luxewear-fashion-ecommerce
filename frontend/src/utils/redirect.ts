/**
 * Only same-site paths such as "/account" are allowed as a post-login destination.
 * Anything else (other sites, "//evil.com", backslashes, control characters) becomes the fallback.
 */
export function safeRedirect(target: string | null | undefined, fallback = "/account"): string {
  if (!target || !target.startsWith("/") || target.startsWith("//")) return fallback;
  if (target.includes("\\") || /[\u0000-\u001f]/.test(target)) return fallback;
  return target;
}
