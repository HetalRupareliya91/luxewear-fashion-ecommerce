import type { Response } from "express";

/** Every success response looks like { success: true, data, meta? }. */
export function sendSuccess<T>(res: Response, data: T, status = 200, meta?: unknown) {
  return res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });
}

/** Every error response looks like { success: false, message, details? }. */
export function sendError(res: Response, status: number, message: string, details?: unknown) {
  return res.status(status).json({ success: false, message, ...(details ? { details } : {}) });
}
