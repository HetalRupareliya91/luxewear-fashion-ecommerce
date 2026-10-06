import test from "node:test";
import assert from "node:assert/strict";
import { parseEnv } from "../src/config/parseEnv.js";

test("uses safe defaults when nothing is set", () => {
  const env = parseEnv({});
  assert.equal(env.nodeEnv, "development");
  assert.equal(env.port, 5000);
  assert.equal(env.frontendUrl, "http://localhost:3000");
  assert.equal(env.databaseUrl, undefined);
});

test("reads valid values and ignores invalid ports", () => {
  assert.equal(parseEnv({ PORT: "8080" }).port, 8080);
  assert.equal(parseEnv({ PORT: "abc" }).port, 5000);
  assert.equal(parseEnv({ PORT: "70000" }).port, 5000);
  assert.equal(parseEnv({ NODE_ENV: "test" }).nodeEnv, "test");
  assert.equal(parseEnv({ NODE_ENV: "weird" }).nodeEnv, "development");
});

test("production refuses weak or placeholder JWT secrets", () => {
  assert.throws(() => parseEnv({ NODE_ENV: "production", JWT_SECRET: "short" }), /JWT_SECRET/);
  assert.throws(() => parseEnv({ NODE_ENV: "production", JWT_SECRET: "replace-with-a-long-random-secret-value-123" }), /JWT_SECRET/);
  assert.equal(parseEnv({ NODE_ENV: "production", JWT_SECRET: "x".repeat(40) }).jwtSecret.length, 40);
});
