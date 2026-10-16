import assert from "node:assert/strict";
import { test } from "node:test";
import { createAuthService } from "../src/modules/auth/auth.service.js";
import { createMemoryUsers } from "./helpers/memoryUsers.js";

function make() {
  const users = createMemoryUsers();
  return { users, service: createAuthService({ users, secret: "s".repeat(32), tokenTtlSeconds: 3600 }) };
}

test("updateProfile saves the new names", async () => {
  const { service } = make();
  const { user } = await service.register({ email: "a@b.co", password: "Passw0rd1", firstName: "Asha", lastName: "Patel" });
  const updated = await service.updateProfile(user.id, { firstName: "Ashvi", lastName: null });
  assert.equal(updated.firstName, "Ashvi");
  assert.equal(updated.lastName, null);
});

test("updateProfile for a deleted account is a 401", async () => {
  const { service } = make();
  await assert.rejects(service.updateProfile("ghost", { firstName: "X" }), { statusCode: 401 });
});

test("changePassword stores a new hash and keeps the old password from working", async () => {
  const { service, users } = make();
  const { user } = await service.register({ email: "a@b.co", password: "Passw0rd1", firstName: "Asha" });
  const before = users.all()[0].passwordHash;
  await service.changePassword(user.id, { currentPassword: "Passw0rd1", newPassword: "N3wPassword" });
  assert.notEqual(users.all()[0].passwordHash, before);
  await assert.rejects(service.login({ email: "a@b.co", password: "Passw0rd1" }), { statusCode: 401 });
  assert.ok((await service.login({ email: "a@b.co", password: "N3wPassword" })).token);
});

test("changePassword refuses a wrong current password or an unchanged one", async () => {
  const { service } = make();
  const { user } = await service.register({ email: "a@b.co", password: "Passw0rd1", firstName: "Asha" });
  await assert.rejects(service.changePassword(user.id, { currentPassword: "nope", newPassword: "N3wPassword" }), { statusCode: 400 });
  await assert.rejects(service.changePassword(user.id, { currentPassword: "Passw0rd1", newPassword: "Passw0rd1" }), { statusCode: 400 });
});
