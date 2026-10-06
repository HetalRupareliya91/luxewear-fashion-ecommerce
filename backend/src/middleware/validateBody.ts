import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import type { ValidationResult } from "../validators/primitives.js";

/** Runs a validator on req.body; replaces it with the cleaned value or forwards a 400. */
export function validateBody<T>(validator: (body: unknown) => ValidationResult<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = validator(req.body);
    if (!result.ok) return next(AppError.badRequest("Validation failed", result.errors));
    req.body = result.value;
    next();
  };
}
