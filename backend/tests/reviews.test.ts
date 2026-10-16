import assert from "node:assert/strict";
import { test } from "node:test";
import { createReviewRouter } from "../src/modules/reviews/review.router.js";
import { createReviewService } from "../src/modules/reviews/review.service.js";
import { createMemoryReviews } from "./helpers/memoryReviews.js";
import { createMemoryUsers } from "./helpers/memoryUsers.js";
import { asAdmin, asUser, startServer, TEST_SECRET } from "./helpers/testServer.js";

async function setup() {
  const users = createMemoryUsers();
  const asha = await users.create({ email: "asha@example.com", passwordHash: "x", firstName: "Asha", lastName: "Patel" });
  const ravi = await users.create({ email: "ravi@example.com", passwordHash: "x", firstName: "Ravi" });
  const reviews = createMemoryReviews([`${asha.id}:p1`, `${ravi.id}:p1`]);
  const service = createReviewService({ reviews, users });
  const server = await startServer((app) => app.use("/reviews", createReviewRouter({ service, secret: TEST_SECRET })));
  return { server, reviews, asha: asUser(asha.id), ravi: asUser(ravi.id), stranger: asUser("nobody") };
}
const review = (extra: Record<string, unknown> = {}) => ({ productId: "p1", rating: 5, body: "Great quality, true to size.", ...extra });

test("reading reviews is public and includes a rating summary", async () => {
  const { server, asha, ravi } = await setup();
  try {
    await server.post("/reviews", review({ rating: 5 }), asha);
    await server.post("/reviews", review({ rating: 4 }), ravi);
    const res = await server.get("/reviews?productId=p1");
    assert.equal(res.status, 200);
    assert.equal(res.json.data.reviews.length, 2);
    assert.equal(res.json.data.summary.count, 2);
    assert.equal(res.json.data.summary.average, 4.5);
    assert.equal(res.json.meta.total, 2);
    assert.equal((await server.get("/reviews")).status, 400);
    assert.equal((await server.get("/reviews?productId=other")).json.data.summary.count, 0);
  } finally {
    await server.close();
  }
});

test("a buyer can review once and the name is shortened", async () => {
  const { server, asha, ravi } = await setup();
  try {
    const first = await server.post("/reviews", review(), asha);
    assert.equal(first.status, 201);
    assert.equal(first.json.data.authorName, "Asha P.");
    assert.equal((await server.post("/reviews", review(), asha)).status, 409);
    assert.equal((await server.post("/reviews", review(), ravi)).json.data.authorName, "Ravi");
  } finally {
    await server.close();
  }
});

test("people who did not buy the product cannot review it", async () => {
  const { server, stranger, asha } = await setup();
  try {
    assert.equal((await server.post("/reviews", review(), stranger)).status, 401); // unknown account
    assert.equal((await server.post("/reviews", review({ productId: "p2" }), asha)).status, 403);
    assert.equal((await server.post("/reviews", review())).status, 401);
    assert.equal((await server.post("/reviews", review({ rating: 9 }), asha)).status, 400);
  } finally {
    await server.close();
  }
});

test("authors and admins can delete a review, other customers cannot", async () => {
  const { server, asha, ravi, reviews } = await setup();
  try {
    const id = (await server.post("/reviews", review(), asha)).json.data.id;
    assert.equal((await server.del(`/reviews/${id}`, ravi)).status, 403);
    assert.equal((await server.del(`/reviews/${id}`, asha)).status, 200);
    assert.equal(reviews.reviews.length, 0);
    const second = (await server.post("/reviews", review(), ravi)).json.data.id;
    assert.equal((await server.del(`/reviews/${second}`, asAdmin())).status, 200);
    assert.equal((await server.del(`/reviews/${second}`, asAdmin())).status, 404);
  } finally {
    await server.close();
  }
});
