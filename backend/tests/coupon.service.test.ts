import assert from "node:assert/strict";
import { test } from "node:test";
import { createCouponService } from "../src/modules/coupons/coupon.service.js";
import { createMemoryCoupons } from "./helpers/memoryCoupons.js";

const now = () => new Date("2026-10-10T00:00:00Z");
const make = () => {
  const repo = createMemoryCoupons([
    { code: "SAVE10", type: "PERCENT", value: 10, active: true, minSubtotal: 5000 },
    { code: "OLD", type: "FIXED", value: 500, active: true, expiresAt: new Date("2026-01-01") },
  ]);
  return { repo, service: createCouponService({ coupons: repo, now }) };
};

test("check returns the discount for a valid code (case-insensitive)", async () => {
  const { service } = make();
  assert.deepEqual(await service.check(" save10 ", 10000), { valid: true, code: "SAVE10", type: "PERCENT", discount: 1000 });
});

test("check explains why a code does not apply", async () => {
  const { service } = make();
  const small = await service.check("SAVE10", 1000);
  assert.equal(small.valid, false);
  const old = await service.check("OLD", 10000);
  assert.deepEqual(old, { valid: false, reason: "This coupon has expired" });
  assert.deepEqual(await service.check("NOPE", 10000), { valid: false, reason: "Coupon code not found" });
});

test("create rejects a duplicate code with 409", async () => {
  const { service } = make();
  await assert.rejects(service.create({ code: "SAVE10", type: "FIXED", value: 100, active: true }), { statusCode: 409 });
});

test("update merges changes and keeps the usage counter", async () => {
  const { service, repo } = make();
  const saved = await service.update("save10", { value: 15, active: false });
  assert.equal(saved.value, 15);
  assert.equal(saved.active, false);
  assert.equal(saved.minSubtotal, 5000);
  assert.equal(repo.all().find((c) => c.code === "SAVE10")?.usedCount, 0);
});

test("update refuses invalid results and unknown codes", async () => {
  const { service } = make();
  await assert.rejects(service.update("SAVE10", { value: 500 }), { statusCode: 400 });
  await assert.rejects(service.update("MISSING", { active: false }), { statusCode: 404 });
});

test("update cannot rename a coupon through the body", async () => {
  const { service, repo } = make();
  await service.update("SAVE10", { code: "HACKED", value: 20 });
  assert.ok(repo.all().some((c) => c.code === "SAVE10" && c.value === 20));
  assert.equal(repo.all().some((c) => c.code === "HACKED"), false);
});

test("remove deletes or reports 404", async () => {
  const { service, repo } = make();
  await service.remove("old");
  assert.equal(repo.all().length, 1);
  await assert.rejects(service.remove("old"), { statusCode: 404 });
});
