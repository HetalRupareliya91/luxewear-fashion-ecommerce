import { Router, type RequestHandler } from "express";
import { validateBody } from "../../middleware/validateBody.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { validateLogin, validateRegister } from "../../validators/auth.js";
import { authCookie, type AuthCookieSettings } from "./auth.cookie.js";
import type { AuthService } from "./auth.service.js";

type Deps = { service: AuthService; secret: string; cookie: AuthCookieSettings; limiter?: RequestHandler };

/** Builds the /auth router. Dependencies are injected so it can be tested without a database. */
export function createAuthRouter({ service, cookie, limiter }: Deps) {
  const router = Router();
  const limit: RequestHandler = limiter ?? ((_req, _res, next) => next());

  // The token travels only in the HttpOnly cookie, never in the JSON body.
  router.post("/register", limit, validateBody(validateRegister), async (req, res) => {
    const { user, token } = await service.register(req.body);
    res.setHeader("Set-Cookie", authCookie(token, cookie));
    sendSuccess(res, { user }, 201);
  });

  router.post("/login", limit, validateBody(validateLogin), async (req, res) => {
    const { user, token } = await service.login(req.body);
    res.setHeader("Set-Cookie", authCookie(token, cookie));
    sendSuccess(res, { user });
  });

  return router;
}
