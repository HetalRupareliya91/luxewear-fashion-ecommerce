import { AppError } from "../../src/errors/AppError.js";
import type { NewUser, UserRecord, UserRepository } from "../../src/modules/auth/auth.types.js";

/** In-memory UserRepository with the same unique-email behaviour as the database. */
export function createMemoryUsers(): UserRepository & { all(): UserRecord[] } {
  const users: UserRecord[] = [];
  let counter = 0;
  return {
    async findByEmail(email) {
      return users.find((u) => u.email === email) ?? null;
    },
    async findById(id) {
      return users.find((u) => u.id === id) ?? null;
    },
    async create(data: NewUser) {
      if (users.some((u) => u.email === data.email)) throw AppError.conflict("An account with this email already exists");
      counter += 1;
      const record: UserRecord = { id: `u${counter}`, email: data.email, passwordHash: data.passwordHash, firstName: data.firstName, lastName: data.lastName ?? null, role: data.role ?? "CUSTOMER", createdAt: new Date() };
      users.push(record);
      return record;
    },
    all: () => users,
  };
}
