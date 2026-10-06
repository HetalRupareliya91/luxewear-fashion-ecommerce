import { createHmac, timingSafeEqual } from "node:crypto";

export type TokenPayload = { sub: string; role: "CUSTOMER" | "ADMIN"; exp: number };

const toB64 = (value: string) => Buffer.from(value).toString("base64url");
const sign = (body: string, secret: string) => createHmac("sha256", secret).update(body).digest("base64url");

/** Creates "<payload>.<signature>". `exp` is unix seconds. */
export function signToken(
  payload: Omit<TokenPayload, "exp">,
  secret: string,
  ttlSeconds = 60 * 60,
  now = Date.now(),
): string {
  const body = toB64(JSON.stringify({ ...payload, exp: Math.floor(now / 1000) + ttlSeconds }));
  return `${body}.${sign(body, secret)}`;
}

/** Returns the payload if the signature is valid and the token has not expired. */
export function verifyToken(token: string, secret: string, now = Date.now()): TokenPayload | null {
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra !== undefined) return null;

  const expected = Buffer.from(sign(body, secret));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as TokenPayload;
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    return payload.exp * 1000 > now ? payload : null;
  } catch {
    return null;
  }
}
