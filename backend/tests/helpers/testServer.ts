import type { AddressInfo } from "node:net";
import express, { type Express } from "express";
import { errorHandler } from "../../src/middleware/errorHandler.js";
import { captureRawBody } from "../../src/middleware/rawBody.js";
import { signToken } from "../../src/modules/auth/token.js";

export const TEST_SECRET = "test-secret";

/** Authorization header for a signed-in test user. */
export const asUser = (sub: string, role: "CUSTOMER" | "ADMIN" = "CUSTOMER") => ({ Authorization: `Bearer ${signToken({ sub, role }, TEST_SECRET, 3600)}` });
export const asAdmin = (sub = "admin1") => asUser(sub, "ADMIN");

type CallOptions = { body?: unknown; headers?: Record<string, string>; rawBody?: string };

/** Starts a real Express server on a random port. `mount` attaches the routers under test. */
export async function startServer(mount: (app: Express) => void) {
  const app = express();
  app.use(express.json({ verify: captureRawBody }));
  mount(app);
  app.use(errorHandler);
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

  async function call(method: string, path: string, options: CallOptions = {}) {
    const hasBody = options.body !== undefined || options.rawBody !== undefined;
    const res = await fetch(base + path, {
      method,
      headers: { ...(hasBody ? { "Content-Type": "application/json" } : {}), ...options.headers },
      body: options.rawBody ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
    });
    return { status: res.status, headers: res.headers, json: (await res.json().catch(() => null)) as any };
  }

  return {
    get: (path: string, headers?: Record<string, string>) => call("GET", path, { headers }),
    post: (path: string, body?: unknown, headers?: Record<string, string>) => call("POST", path, { body, headers }),
    patch: (path: string, body?: unknown, headers?: Record<string, string>) => call("PATCH", path, { body, headers }),
    put: (path: string, body?: unknown, headers?: Record<string, string>) => call("PUT", path, { body, headers }),
    del: (path: string, headers?: Record<string, string>) => call("DELETE", path, { headers }),
    call,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}
