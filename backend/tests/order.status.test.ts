import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/errors/AppError.js";
import { assertTransition, canTransition, isFinal, nextStatuses } from "../src/modules/orders/order.status.js";

test("happy path is allowed step by step", () => {
  const path = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const;
  for (let i = 0; i < path.length - 1; i++) assert.equal(canTransition(path[i], path[i + 1]), true);
});

test("skipping steps or going backwards is not allowed", () => {
  assert.equal(canTransition("PENDING", "SHIPPED"), false);
  assert.equal(canTransition("SHIPPED", "PROCESSING"), false);
  assert.equal(canTransition("DELIVERED", "CANCELLED"), false);
});

test("assertTransition throws a 409 AppError listing allowed moves", () => {
  try {
    assertTransition("SHIPPED", "CANCELLED");
    assert.fail("should have thrown");
  } catch (err) {
    assert.ok(err instanceof AppError);
    assert.equal(err.statusCode, 409);
    assert.match(err.message, /Allowed: DELIVERED/);
  }
  assert.equal(assertTransition("PENDING", "PAID"), "PAID");
});

test("cancelled and refunded orders are final", () => {
  assert.equal(isFinal("CANCELLED"), true);
  assert.equal(isFinal("REFUNDED"), true);
  assert.equal(isFinal("PAID"), false);
  assert.deepEqual(nextStatuses("PENDING"), ["PAID", "CANCELLED"]);
});
