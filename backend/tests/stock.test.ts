import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/errors/AppError.js";
import { available, findShortages, releaseStock, reserveStock, type StockLevel } from "../src/modules/inventory/stock.js";

const levels: StockLevel[] = [
  { sku: "A", onHand: 5, reserved: 2 },
  { sku: "B", onHand: 1, reserved: 1 },
];

test("available = onHand - reserved, never negative", () => {
  assert.equal(available(levels[0]), 3);
  assert.equal(available({ sku: "X", onHand: 1, reserved: 4 }), 0);
});

test("findShortages reports short and unknown SKUs", () => {
  assert.deepEqual(findShortages(levels, [{ sku: "A", quantity: 4 }, { sku: "B", quantity: 1 }, { sku: "Z", quantity: 1 }]), [
    { sku: "A", requested: 4, available: 3 },
    { sku: "B", requested: 1, available: 0 },
    { sku: "Z", requested: 1, available: 0 },
  ]);
});

test("reserveStock is all-or-nothing and does not mutate the input", () => {
  const after = reserveStock(levels, [{ sku: "A", quantity: 3 }]);
  assert.equal(after[0].reserved, 5);
  assert.equal(levels[0].reserved, 2);
  assert.throws(() => reserveStock(levels, [{ sku: "A", quantity: 1 }, { sku: "B", quantity: 1 }]), (e: unknown) => e instanceof AppError && e.statusCode === 409);
});

test("duplicate lines for one SKU are combined", () => {
  assert.throws(() => reserveStock(levels, [{ sku: "A", quantity: 2 }, { sku: "A", quantity: 2 }]), AppError);
});

test("releaseStock gives reservations back but not below zero", () => {
  assert.equal(releaseStock(levels, [{ sku: "A", quantity: 1 }])[0].reserved, 1);
  assert.equal(releaseStock(levels, [{ sku: "A", quantity: 99 }])[0].reserved, 0);
});
