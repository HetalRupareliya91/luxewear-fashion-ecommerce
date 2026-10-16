import { prisma } from "../../config/prisma.js";
import type { UserAdminRepository } from "./user.admin.js";

const select = { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true };

/** Prisma implementation of UserAdminRepository. The password hash is never selected. */
export const prismaUserAdminRepository: UserAdminRepository = {
  async list({ search, skip, limit }) {
    const where = search ? { OR: [{ email: { contains: search, mode: "insensitive" } }, { firstName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } }] } : {};
    const [items, total] = await Promise.all([prisma.user.findMany({ where, select, orderBy: { createdAt: "desc" }, skip, take: limit }), prisma.user.count({ where })]);
    return { items, total };
  },

  async findById(id) {
    return prisma.user.findUnique({ where: { id }, select });
  },

  async setRole(id, role) {
    return prisma.user.update({ where: { id }, data: { role }, select });
  },
};
