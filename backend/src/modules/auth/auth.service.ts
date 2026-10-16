import { AppError } from "../../errors/AppError.js";
import type { LoginInput, RegisterInput } from "../../validators/auth.js";
import { hashPassword, verifyPassword } from "./password.js";
import { signToken } from "./token.js";
import type { AuthResult, PublicUser, UserRecord, UserRepository } from "./auth.types.js";

export const toPublicUser = (u: UserRecord): PublicUser => ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role });

type Deps = { users: UserRepository; secret: string; tokenTtlSeconds: number; now?: () => number };

export type AuthService = {
  register(input: RegisterInput): Promise<AuthResult>;
  login(input: LoginInput): Promise<AuthResult>;
  getProfile(userId: string): Promise<PublicUser>;
};

export function createAuthService({ users, secret, tokenTtlSeconds, now = Date.now }: Deps): AuthService {
  // Compared against when the email is unknown so a missing account takes as long as a wrong password.
  let dummyHash: Promise<string> | undefined;
  const getDummyHash = () => (dummyHash ??= hashPassword("not-a-real-password"));

  const issue = (user: UserRecord): AuthResult => ({ user: toPublicUser(user), token: signToken({ sub: user.id, role: user.role }, secret, tokenTtlSeconds, now()) });

  return {
    async register(input) {
      if (await users.findByEmail(input.email)) throw AppError.conflict("An account with this email already exists");
      // New accounts are always customers; admins are created with `npm run admin:create`.
      const user = await users.create({ email: input.email, passwordHash: await hashPassword(input.password), firstName: input.firstName, lastName: input.lastName, role: "CUSTOMER" });
      return issue(user);
    },

    async login({ email, password }) {
      const user = await users.findByEmail(email);
      const ok = await verifyPassword(password, user ? user.passwordHash : await getDummyHash());
      if (!user || !ok) throw AppError.unauthorized("Invalid email or password");
      return issue(user);
    },

    async getProfile(userId) {
      const user = await users.findById(userId);
      if (!user) throw AppError.unauthorized("Account no longer exists");
      return toPublicUser(user);
    },
  };
}
