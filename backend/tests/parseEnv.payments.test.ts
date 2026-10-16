import assert from "node:assert/strict";
import { test } from "node:test";
import { parseEnv } from "../src/config/parseEnv.js";

const prod = { NODE_ENV: "production", JWT_SECRET: "x".repeat(40) };

test("development gets a default webhook secret", () => {
  assert.equal(parseEnv({}).paymentWebhookSecret, "dev-only-webhook-secret");
  assert.equal(parseEnv({ PAYMENT_WEBHOOK_SECRET: "whsec_abc" }).paymentWebhookSecret, "whsec_abc");
});

test("production refuses a missing or weak webhook secret", () => {
  assert.throws(() => parseEnv(prod), /PAYMENT_WEBHOOK_SECRET/);
  assert.throws(() => parseEnv({ ...prod, PAYMENT_WEBHOOK_SECRET: "short" }), /PAYMENT_WEBHOOK_SECRET/);
  assert.throws(() => parseEnv({ ...prod, PAYMENT_WEBHOOK_SECRET: "replace-with-" + "y".repeat(40) }), /PAYMENT_WEBHOOK_SECRET/);
  assert.equal(parseEnv({ ...prod, PAYMENT_WEBHOOK_SECRET: "w".repeat(40) }).paymentWebhookSecret, "w".repeat(40));
});
