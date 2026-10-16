import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/errors/AppError.js";
import { createAuthService } from "../src/modules/auth/auth.service.js";
import { verifyToken } from "../src/modules/auth/token.js";
import { verifyPassword } from "../src/modules/auth/password.js";
import { createMemoryUsers } from "./helpers/memoryUsers.js";

const secret = "unit-test-secret";
const input = { email: "asha@example.com", password: "Correct-Horse-9", firstName: "Asha" };

function setup(now = () => 1_000_000) {
  const users = createMemoryUsers();
  return { users, service: createAuthService({ users, secret, tokenTtlSeconds: 3600, now }) };
}

test("register stores a hashed password and returns a signed token without the hash", async () => {
  const { service, users } = setup();
  const { user, token } = await service.register(input);
  assert.deepEqual(Object.keys(user).sort(), ["email", "firstName", "id", "lastName", "role"]);
  assert.equal(user.role, "CUSTOMER");
  const stored = users.all()[0];
  assert.notEqual(stored.passwordHash, input.password);
  assert.equal(await verifyPassword(input.password, stored.passwordHash), true);
  assert.deepEqual(verifyToken(token, secret, 1_000_000), { sub: user.id, role: "CUSTOMER", exp: 1000 + 3600 });
});

test("register rejects a duplicate email with 409", async () => {
  const { service } = setup();
  await service.register(input);
  await assert.rejects(service.register(input), (e: unknown) => e instanceof AppError && e.statusCode === 409);
});

test("login succeeds with the right password", async () => {
  const { service } = setup();
  await service.register(input);
  const result = await service.login({ email: input.email, password: input.password });
  assert.equal(result.user.email, input.email);
  assert.ok(verifyToken(result.token, secret, 1_000_000));
});

test("wrong password and unknown email give the same 401 message", async () => {
  const { service } = setup();
  await service.register(input);
  const wrongPassword = await service.login({ email: input.email, password: "nope" }).catch((e) => e);
  const unknownEmail = await service.login({ email: "ghost@example.com", password: "nope" }).catch((e) => e);
  for (const e of [wrongPassword, unknownEmail]) {
    assert.ok(e instanceof AppError);
    assert.equal(e.statusCode, 401);
  }
  assert.equal(wrongPassword.message, unknownEmail.message);
});

test("getProfile returns the public user or 401 when the account is gone", async () => {
  const { service } = setup();
  const { user } = await service.register(input);
  assert.deepEqual(await service.getProfile(user.id), user);
  await assert.rejects(service.getProfile("missing"), (e: unknown) => e instanceof AppError && e.statusCode === 401);
});

test("a role in the input is ignored: registration always creates a customer", async () => {
  const { service, users } = setup();
  await service.register({ ...input, role: "ADMIN" } as typeof input);
  assert.equal(users.all()[0].role, "CUSTOMER");
});
