import type { AddressInfo } from "node:net";
import type { RequestHandler } from "express";
import express from "express";
import { errorHandler } from "../../src/middleware/errorHandler.js";
import { createAuthService } from "../../src/modules/auth/auth.service.js";
import { createAuthRouter } from "../../src/modules/auth/auth.router.js";
import { createMemoryUsers } from "./memoryUsers.js";

export const SECRET = "http-test-secret";

/** Starts a real Express server (random port) with the auth router and an in-memory user store. */
export async function startAuthApp(options: { limiter?: RequestHandler } = {}) {
  const users = createMemoryUsers();
  const service = createAuthService({ users, secret: SECRET, tokenTtlSeconds: 3600 });
  const app = express();
  app.use(express.json());
  app.use("/api/auth", createAuthRouter({ service, secret: SECRET, cookie: { maxAgeSeconds: 3600, secure: false, sameSite: "lax" }, limiter: options.limiter }));
  app.use(errorHandler);

  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/auth`;

  /** Tiny fetch wrapper that remembers the login cookie like a browser would. */
  function client() {
    let cookie = "";
    return {
      async request(path: string, init: { method?: string; body?: unknown; headers?: Record<string, string>; rawBody?: string } = {}) {
        const res = await fetch(base + path, {
          method: init.method ?? (init.body !== undefined || init.rawBody !== undefined ? "POST" : "GET"),
          headers: { ...(init.body !== undefined || init.rawBody !== undefined ? { "Content-Type": "application/json" } : {}), ...(cookie ? { Cookie: cookie } : {}), ...init.headers },
          body: init.rawBody ?? (init.body !== undefined ? JSON.stringify(init.body) : undefined),
        });
        const setCookie = res.headers.getSetCookie().find((c) => c.startsWith("lw_token="));
        if (setCookie) cookie = setCookie.startsWith("lw_token=;") ? "" : setCookie.split(";")[0];
        return { status: res.status, setCookie, json: (await res.json().catch(() => null)) as any };
      },
      get cookie() {
        return cookie;
      },
    };
  }

  return { users, client, close: () => new Promise<void>((resolve) => server.close(() => resolve())) };
}
