export type UserRole = "CUSTOMER" | "ADMIN";

/** What the database stores. */
export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string | null;
  role: UserRole;
  createdAt: Date;
};

/** What the API is allowed to send back (never the password hash). */
export type PublicUser = { id: string; email: string; firstName: string; lastName: string | null; role: UserRole };

export type NewUser = { email: string; passwordHash: string; firstName: string; lastName?: string; role?: UserRole };

/** Storage the auth service needs. Implemented with Prisma in production and in memory in tests. */
export type UserRepository = {
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  /** Must throw AppError.conflict when the email is already registered. */
  create(data: NewUser): Promise<UserRecord>;
};

export type AuthResult = { user: PublicUser; token: string };
