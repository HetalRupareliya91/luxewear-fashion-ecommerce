import assert from "node:assert/strict";
import { test } from "node:test";
import { signPayload, verifySignature } from "../src/modules/payments/signature.js";

const body = '{"type":"payment.succeeded","reference":"mock_1"}';

test("a signature we made verifies", () => {
  const header = signPayload(body, "secret");
  assert.match(header, /^sha256=[0-9a-f]{64}$/);
  assert.equal(verifySignature(body, header, "secret"), true);
  assert.equal(verifySignature(Buffer.from(body), header, "secret"), true);
});

test("a changed body, wrong secret or missing header fails", () => {
  const header = signPayload(body, "secret");
  assert.equal(verifySignature(body + " ", header, "secret"), false);
  assert.equal(verifySignature(body, header, "other"), false);
  assert.equal(verifySignature(body, undefined, "secret"), false);
  assert.equal(verifySignature(body, "sha256=abc", "secret"), false);
  assert.equal(verifySignature(body, "", "secret"), false);
});
