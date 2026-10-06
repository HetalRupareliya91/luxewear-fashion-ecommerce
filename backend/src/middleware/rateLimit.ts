import type { NextFunction, Request, Response } from "express";

type Options = {
  windowMs?: number;
  max?: number;
  message?: string;
  now?: () => number;
  keyGenerator?: (req: Request) => string;
};

/** Small in-memory limiter. Fine for one server instance; use Redis if you scale out. */
export function createRateLimiter({
  windowMs = 60_000,
  max = 100,
  message = "Too many requests, please try again later.",
  now = Date.now,
  keyGenerator = (req) => req.ip ?? "unknown",
}: Options = {}) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function rateLimit(req: Request, res: Response, next: NextFunction) {
    const key = keyGenerator(req);
    const time = now();
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= time) {
      entry = { count: 0, resetAt: time + windowMs };
      hits.set(key, entry);
      for (const [k, v] of hits) if (v.resetAt <= time) hits.delete(k); // tidy expired keys
    }
    entry.count += 1;
    if (entry.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((entry.resetAt - time) / 1000)));
      res.status(429).json({ success: false, message });
      return;
    }
    next();
  };
}
