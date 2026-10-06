import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { verifyToken, type TokenPayload } from "../modules/auth/token.js";

/** Requires "Authorization: Bearer <token>" and stores the payload in res.locals.user. */
export function requireAuth(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    const payload = token ? verifyToken(token, secret) : null;
    if (!payload) return next(AppError.unauthorized("Invalid or expired token"));
    res.locals.user = payload;
    next();
  };
}

/** Use after requireAuth: allows only the listed roles. */
export function requireRole(...roles: TokenPayload["role"][]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as TokenPayload | undefined;
    if (!user) return next(AppError.unauthorized());
    if (!roles.includes(user.role)) return next(AppError.forbidden());
    next();
  };
}
