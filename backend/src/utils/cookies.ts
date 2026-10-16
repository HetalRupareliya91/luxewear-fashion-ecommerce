export type CookieOptions = {
  maxAgeSeconds?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
};

/** Parses a Cookie request header into a name -> value map (bad escapes are kept as-is). */
export function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const name = part.slice(0, eq).trim();
    if (!name) continue;
    let value = part.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) value = value.slice(1, -1);
    try {
      value = decodeURIComponent(value);
    } catch {
      // keep the raw value
    }
    if (!(name in out)) out[name] = value;
  }
  return out;
}

/** Builds a Set-Cookie header value. HttpOnly and Path=/ are on by default. */
export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  const { maxAgeSeconds, httpOnly = true, secure = false, sameSite = "lax", path = "/" } = options;
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`];
  if (maxAgeSeconds !== undefined) parts.push(`Max-Age=${Math.max(Math.floor(maxAgeSeconds), 0)}`);
  if (httpOnly) parts.push("HttpOnly");
  if (secure) parts.push("Secure");
  parts.push(`SameSite=${sameSite[0].toUpperCase()}${sameSite.slice(1)}`);
  return parts.join("; ");
}

/** A Set-Cookie value that removes the cookie in the browser. */
export const clearCookie = (name: string, options: CookieOptions = {}): string => serializeCookie(name, "", { ...options, maxAgeSeconds: 0 });
