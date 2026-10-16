export type Env = {
  nodeEnv: "development" | "test" | "production";
  port: number;
  frontendUrl: string;
  databaseUrl: string | undefined;
  jwtSecret: string;
  /** How long a login lasts, in seconds (default 7 days). */
  tokenTtlSeconds: number;
  cookieSameSite: "lax" | "strict" | "none";
  /** Always true in production and whenever SameSite=None (browsers require it). */
  cookieSecure: boolean;
  /** Shared secret used to check webhook signatures from the payment company. */
  paymentWebhookSecret: string;
};

const NODE_ENVS = ["development", "test", "production"] as const;
const SAME_SITE = ["lax", "strict", "none"] as const;

/** Validates and normalises environment variables. Throws on unsafe production settings. */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const nodeEnv = NODE_ENVS.find((v) => v === source.NODE_ENV) ?? "development";
  const port = Number(source.PORT);
  const jwtSecret = source.JWT_SECRET ?? "";
  const ttl = Number(source.TOKEN_TTL_SECONDS);
  const cookieSameSite = SAME_SITE.find((v) => v === source.COOKIE_SAMESITE?.toLowerCase()) ?? "lax";
  const paymentWebhookSecret = source.PAYMENT_WEBHOOK_SECRET ?? "";

  if (nodeEnv === "production" && (jwtSecret.length < 32 || jwtSecret.startsWith("replace-with"))) {
    throw new Error("JWT_SECRET must be a strong secret (32+ characters) in production");
  }
  if (nodeEnv === "production" && (paymentWebhookSecret.length < 32 || paymentWebhookSecret.startsWith("replace-with"))) {
    throw new Error("PAYMENT_WEBHOOK_SECRET must be a strong secret (32+ characters) in production");
  }

  return {
    nodeEnv,
    port: Number.isInteger(port) && port > 0 && port < 65536 ? port : 5000,
    frontendUrl: source.FRONTEND_URL || "http://localhost:3000",
    databaseUrl: source.DATABASE_URL || undefined,
    jwtSecret: jwtSecret || "dev-only-secret-change-me",
    tokenTtlSeconds: Number.isFinite(ttl) && ttl >= 60 ? Math.floor(ttl) : 7 * 24 * 60 * 60,
    cookieSameSite,
    cookieSecure: nodeEnv === "production" || cookieSameSite === "none",
    paymentWebhookSecret: paymentWebhookSecret || "dev-only-webhook-secret",
  };
}
