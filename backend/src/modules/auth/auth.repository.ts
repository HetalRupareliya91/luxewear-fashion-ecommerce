import { prisma } from "../../config/prisma.js";
import { AppError } from "../../errors/AppError.js";
import type { NewUser, UserRecord, UserRepository, UserUpdate } from "./auth.types.js";

/** Prisma implementation of UserRepository. */
export const prismaUserRepository: UserRepository = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string): Promise<UserRecord | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: NewUser): Promise<UserRecord> {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      // P2002 = unique constraint failed (two sign-ups with the same email at once)
      if ((error as { code?: string }).code === "P2002") throw AppError.conflict("An account with this email already exists");
      throw error;
    }
  },

  async update(id: string, data: UserUpdate): Promise<UserRecord> {
    try {
      return await prisma.user.update({ where: { id }, data });
    } catch (error) {
      // P2025 = the record to update was not found
      if ((error as { code?: string }).code === "P2025") throw AppError.notFound("User not found");
      throw error;
    }
  },
};
