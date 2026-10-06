import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

/** Gives every request an id (reusing a sane incoming X-Request-Id) and echoes it back. */
export function requestId(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header("x-request-id");
  const id = incoming && /^[\w.-]{8,64}$/.test(incoming) ? incoming : randomUUID();
  res.locals.requestId = id;
  res.setHeader("X-Request-Id", id);
  next();
}
