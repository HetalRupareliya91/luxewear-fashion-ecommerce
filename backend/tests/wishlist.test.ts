import assert from "node:assert/strict";
import { test } from "node:test";
import { AppError } from "../src/errors/AppError.js";
import { createWishlistRouter } from "../src/modules/wishlist/wishlist.router.js";
import { createWishlistService } from "../src/modules/wishlist/wishlist.service.js";
import type { WishlistRepository } from "../src/modules/wishlist/wishlist.types.js";
import { asUser, startServer, TEST_SECRET } from "./helpers/testServer.js";

const PRODUCTS = new Set(["p1", "p2", "p3"]);

function memoryWishlist(): WishlistRepository {
  const lists = new Map<string, string[]>();
  return {
    async list(userId) {
      return [...(lists.get(userId) ?? [])].reverse();
    },
    async add(userId, productId) {
      if (!PRODUCTS.has(productId)) throw AppError.notFound("Product not found");
      const list = lists.get(userId) ?? [];
      if (!list.includes(productId)) list.push(productId);
      lists.set(userId, list);
    },
    async remove(userId, productId) {
      lists.set(userId, (lists.get(userId) ?? []).filter((id) => id !== productId));
    },
  };
}

async function setup() {
  const service = createWishlistService({ wishlist: memoryWishlist() });
  const server = await startServer((app) => app.use("/wishlist", createWishlistRouter({ service, secret: TEST_SECRET })));
  return { server, u1: asUser("u1"), u2: asUser("u2") };
}

test("the wishlist needs a signed-in user", async () => {
  const { server } = await setup();
  try {
    assert.equal((await server.get("/wishlist")).status, 401);
    assert.equal((await server.put("/wishlist/p1")).status, 401);
  } finally {
    await server.close();
  }
});

test("add, list and remove products", async () => {
  const { server, u1, u2 } = await setup();
  try {
    assert.deepEqual((await server.get("/wishlist", u1)).json.data, { productIds: [] });
    assert.deepEqual((await server.put("/wishlist/p1", undefined, u1)).json.data.productIds, ["p1"]);
    assert.deepEqual((await server.put("/wishlist/p2", undefined, u1)).json.data.productIds, ["p2", "p1"]);
    assert.deepEqual((await server.put("/wishlist/p2", undefined, u1)).json.data.productIds, ["p2", "p1"]);
    assert.deepEqual((await server.del("/wishlist/p1", u1)).json.data.productIds, ["p2"]);
    assert.deepEqual((await server.get("/wishlist", u2)).json.data.productIds, []);
    assert.equal((await server.put("/wishlist/unknown", undefined, u1)).status, 404);
  } finally {
    await server.close();
  }
});

test("merge adds browser items, skips unknown ids and keeps existing ones", async () => {
  const { server, u1 } = await setup();
  try {
    await server.put("/wishlist/p3", undefined, u1);
    const res = await server.post("/wishlist/merge", { productIds: ["p1", "ghost", "p3", "p1"] }, u1);
    assert.equal(res.status, 200);
    assert.deepEqual([...res.json.data.productIds].sort(), ["p1", "p3"]);
    assert.equal((await server.post("/wishlist/merge", { productIds: "p1" }, u1)).status, 400);
    assert.equal((await server.post("/wishlist/merge", { productIds: [""] }, u1)).status, 400);
  } finally {
    await server.close();
  }
});
