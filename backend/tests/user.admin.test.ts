import assert from "node:assert/strict";
import { test } from "node:test";
import type { PublicUser, UserRole } from "../src/modules/auth/auth.types.js";
import { createUserAdminService, type UserAdminRepository } from "../src/modules/users/user.admin.js";
import { createUserAdminRouter } from "../src/modules/users/user.router.js";
import { asAdmin, asUser, startServer, TEST_SECRET } from "./helpers/testServer.js";

type Row = PublicUser & { createdAt: Date };
const rows: Row[] = [
  { id: "admin1", email: "boss@luxewear.test", firstName: "Boss", lastName: null, role: "ADMIN", createdAt: new Date("2026-01-01") },
  { id: "u1", email: "asha@example.com", firstName: "Asha", lastName: "Patel", role: "CUSTOMER", createdAt: new Date("2026-02-01") },
  { id: "u2", email: "ravi@example.com", firstName: "Ravi", lastName: null, role: "CUSTOMER", createdAt: new Date("2026-03-01") },
];

function memoryAdminRepo(): UserAdminRepository {
  const data = rows.map((r) => ({ ...r }));
  return {
    async list({ search, skip, limit }) {
      const q = search?.toLowerCase();
      const matching = data.filter((u) => !q || u.email.includes(q) || u.firstName.toLowerCase().includes(q));
      return { items: matching.slice(skip, skip + limit), total: matching.length };
    },
    async findById(id) {
      return data.find((u) => u.id === id) ?? null;
    },
    async setRole(id, role: UserRole) {
      const user = data.find((u) => u.id === id)!;
      user.role = role;
      return user;
    },
  };
}

async function setup() {
  const service = createUserAdminService({ users: memoryAdminRepo() });
  const server = await startServer((app) => app.use("/admin/users", createUserAdminRouter({ service, secret: TEST_SECRET })));
  return { server };
}

test("only admins can list users", async () => {
  const { server } = await setup();
  try {
    assert.equal((await server.get("/admin/users")).status, 401);
    assert.equal((await server.get("/admin/users", asUser("u1"))).status, 403);
    const res = await server.get("/admin/users", asAdmin());
    assert.equal(res.status, 200);
    assert.equal(res.json.data.length, 3);
    assert.equal(res.json.meta.total, 3);
    assert.equal(JSON.stringify(res.json).includes("passwordHash"), false);
  } finally {
    await server.close();
  }
});

test("users can be searched and paged", async () => {
  const { server } = await setup();
  try {
    assert.equal((await server.get("/admin/users?q=ravi", asAdmin())).json.data.length, 1);
    const page = await server.get("/admin/users?limit=2&page=2", asAdmin());
    assert.equal(page.json.data.length, 1);
    assert.equal(page.json.meta.pages, 2);
  } finally {
    await server.close();
  }
});

test("an admin can promote a customer but not change their own role", async () => {
  const { server } = await setup();
  try {
    const promoted = await server.patch("/admin/users/u1/role", { role: "ADMIN" }, asAdmin());
    assert.equal(promoted.status, 200);
    assert.equal(promoted.json.data.role, "ADMIN");
    assert.equal((await server.patch("/admin/users/admin1/role", { role: "CUSTOMER" }, asAdmin("admin1"))).status, 403);
    assert.equal((await server.patch("/admin/users/ghost/role", { role: "ADMIN" }, asAdmin())).status, 404);
    assert.equal((await server.patch("/admin/users/u2/role", { role: "OWNER" }, asAdmin())).status, 400);
  } finally {
    await server.close();
  }
});
