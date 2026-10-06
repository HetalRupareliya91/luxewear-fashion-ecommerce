export type Env = {
  nodeEnv: "development" | "test" | "production";
  port: number;
  frontendUrl: string;
  databaseUrl: string | undefined;
  jwtSecret: string;
};

const NODE_ENVS = ["development", "test", "production"] as const;

/** Validates and normalises environment variables. Throws on unsafe production settings. */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const nodeEnv = NODE_ENVS.find((v) => v === source.NODE_ENV) ?? "development";
  const port = Number(source.PORT);
  const jwtSecret = source.JWT_SECRET ?? "";

  if (nodeEnv === "production" && (jwtSecret.length < 32 || jwtSecret.startsWith("replace-with"))) {
    throw new Error("JWT_SECRET must be a strong secret (32+ characters) in production");
  }

  return {
    nodeEnv,
    port: Number.isInteger(port) && port > 0 && port < 65536 ? port : 5000,
    frontendUrl: source.FRONTEND_URL || "http://localhost:3000",
    databaseUrl: source.DATABASE_URL || undefined,
    jwtSecret: jwtSecret || "dev-only-secret-change-me",
  };
}
