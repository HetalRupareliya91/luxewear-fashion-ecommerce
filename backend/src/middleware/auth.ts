import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { AUTH_COOKIE_NAME } from "../modules/auth/auth.cookie.js";
import { verifyToken, type TokenPayload } from "../modules/auth/token.js";
import { parseCookies } from "../utils/cookies.js";

/** "Authorization: Bearer <token>" wins; otherwise the HttpOnly login cookie is used. */
function extractToken(req: Request): string {
  const header = req.header("authorization") ?? "";
  if (header.startsWith("Bearer ")) return header.slice(7).trim();
  return parseCookies(req.header("cookie"))[AUTH_COOKIE_NAME] ?? "";
}

/** Verifies the token and stores the payload in res.locals.user. */
export function requireAuth(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req);
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
