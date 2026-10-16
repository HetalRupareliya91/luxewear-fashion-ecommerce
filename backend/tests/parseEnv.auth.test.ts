import test from "node:test";
import assert from "node:assert/strict";
import { parseEnv } from "../src/config/parseEnv.js";

test("login settings have safe defaults", () => {
  const env = parseEnv({});
  assert.equal(env.tokenTtlSeconds, 604800);
  assert.equal(env.cookieSameSite, "lax");
  assert.equal(env.cookieSecure, false);
});

test("TOKEN_TTL_SECONDS must be at least a minute", () => {
  assert.equal(parseEnv({ TOKEN_TTL_SECONDS: "3600" }).tokenTtlSeconds, 3600);
  assert.equal(parseEnv({ TOKEN_TTL_SECONDS: "10" }).tokenTtlSeconds, 604800);
  assert.equal(parseEnv({ TOKEN_TTL_SECONDS: "abc" }).tokenTtlSeconds, 604800);
});

test("COOKIE_SAMESITE is whitelisted and None forces Secure", () => {
  assert.equal(parseEnv({ COOKIE_SAMESITE: "STRICT" }).cookieSameSite, "strict");
  assert.equal(parseEnv({ COOKIE_SAMESITE: "weird" }).cookieSameSite, "lax");
  assert.equal(parseEnv({ COOKIE_SAMESITE: "none" }).cookieSecure, true);
});

test("production always uses Secure cookies", () => {
  assert.equal(parseEnv({ NODE_ENV: "production", JWT_SECRET: "x".repeat(40) }).cookieSecure, true);
});
