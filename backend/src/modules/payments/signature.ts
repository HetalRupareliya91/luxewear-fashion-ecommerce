import { createHmac, timingSafeEqual } from "node:crypto";

/** "sha256=<hex>" of the exact request bytes, signed with the shared webhook secret. */
export function signPayload(payload: Buffer | string, secret: string): string {
  return `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`;
}

/** Constant-time comparison, so a forged signature cannot be found by timing guesses. */
export function verifySignature(payload: Buffer | string, header: string | undefined, secret: string): boolean {
  if (!header) return false;
  const expected = Buffer.from(signPayload(payload, secret));
  const actual = Buffer.from(header);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
