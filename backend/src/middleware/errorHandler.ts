import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

/** Errors thrown by express.json() carry a 4xx status (bad JSON, body too large). */
function bodyParserStatus(error: unknown): number | null {
  const e = error as { status?: unknown; statusCode?: unknown; type?: unknown } | null;
  const status = typeof e?.status === "number" ? e.status : typeof e?.statusCode === "number" ? e.statusCode : null;
  return status !== null && status >= 400 && status < 500 && typeof e?.type === "string" ? status : null;
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }

  const status = bodyParserStatus(error);
  if (status !== null) {
    res.status(status).json({ success: false, message: status === 413 ? "Request body is too large" : "Invalid request body" });
    return;
  }

  console.error(error);
  res.status(500).json({ success: false, message: "Internal server error" });
}
