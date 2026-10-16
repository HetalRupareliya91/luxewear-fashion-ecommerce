import { env } from "../../config/env.js";
import { createRateLimiter } from "../../middleware/rateLimit.js";
import { prismaUserRepository } from "./auth.repository.js";
import { createAuthRouter } from "./auth.router.js";
import { createAuthService } from "./auth.service.js";

const service = createAuthService({ users: prismaUserRepository, secret: env.jwtSecret, tokenTtlSeconds: env.tokenTtlSeconds });

export default createAuthRouter({
  service,
  secret: env.jwtSecret,
  cookie: { maxAgeSeconds: env.tokenTtlSeconds, secure: env.cookieSecure, sameSite: env.cookieSameSite },
  // Sign-in and sign-up are the favourite targets for password guessing: 10 tries a minute per IP.
  limiter: createRateLimiter({ windowMs: 60_000, max: 10, message: "Too many attempts, please try again in a minute." }),
});
