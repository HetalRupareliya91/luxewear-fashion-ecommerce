import assert from "node:assert/strict";
import { test } from "node:test";
import { createRateLimiter } from "../src/middleware/rateLimit.js";
import { createCouponRouter } from "../src/modules/coupons/coupon.router.js";
import { createCouponService } from "../src/modules/coupons/coupon.service.js";
import { createMemoryCoupons } from "./helpers/memoryCoupons.js";
import { asAdmin, asUser, startServer, TEST_SECRET } from "./helpers/testServer.js";

async function setup(limiterMax = 100) {
  const repo = createMemoryCoupons([{ code: "SAVE10", type: "PERCENT", value: 10, active: true }]);
  const service = createCouponService({ coupons: repo });
  const server = await startServer((app) =>
    app.use("/coupons", createCouponRouter({ service, secret: TEST_SECRET, limiter: createRateLimiter({ max: limiterMax }) })),
  );
  return { repo, server };
}

test("anyone can check a code", async () => {
  const { server } = await setup();
  try {
    const ok = await server.post("/coupons/validate", { code: "save10", subtotal: 20000 });
    assert.equal(ok.status, 200);
    assert.deepEqual(ok.json.data, { valid: true, code: "SAVE10", type: "PERCENT", discount: 2000 });
    const unknown = await server.post("/coupons/validate", { code: "NOPE1", subtotal: 20000 });
    assert.equal(unknown.status, 200);
    assert.equal(unknown.json.data.valid, false);
    assert.equal((await server.post("/coupons/validate", { code: "x" })).status, 400);
  } finally {
    await server.close();
  }
});

test("checking codes is rate limited", async () => {
  const { server } = await setup(2);
  try {
    await server.post("/coupons/validate", { code: "SAVE10", subtotal: 100 });
    await server.post("/coupons/validate", { code: "SAVE10", subtotal: 100 });
    assert.equal((await server.post("/coupons/validate", { code: "SAVE10", subtotal: 100 })).status, 429);
  } finally {
    await server.close();
  }
});

test("management needs an admin", async () => {
  const { server } = await setup();
  try {
    assert.equal((await server.get("/coupons")).status, 401);
    assert.equal((await server.get("/coupons", asUser("u1"))).status, 403);
    const list = await server.get("/coupons", asAdmin());
    assert.equal(list.status, 200);
    assert.equal(list.json.data.length, 1);
  } finally {
    await server.close();
  }
});

test("an admin can create, edit and delete a coupon", async () => {
  const { server } = await setup();
  try {
    const created = await server.post("/coupons", { code: "summer5", type: "FIXED", value: 500 }, asAdmin());
    assert.equal(created.status, 201);
    assert.equal(created.json.data.code, "SUMMER5");
    assert.equal((await server.post("/coupons", { code: "SUMMER5", type: "FIXED", value: 500 }, asAdmin())).status, 409);
    assert.equal((await server.post("/coupons", { code: "bad code", type: "FIXED", value: 500 }, asAdmin())).status, 400);

    const edited = await server.patch("/coupons/summer5", { active: false }, asAdmin());
    assert.equal(edited.status, 200);
    assert.equal(edited.json.data.active, false);

    assert.equal((await server.del("/coupons/SUMMER5", asAdmin())).status, 200);
    assert.equal((await server.del("/coupons/SUMMER5", asAdmin())).status, 404);
  } finally {
    await server.close();
  }
});
