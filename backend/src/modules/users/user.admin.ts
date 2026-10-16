import { AppError } from "../../errors/AppError.js";
import { buildMeta } from "../../utils/pagination.js";
import type { PublicUser, UserRole } from "../auth/auth.types.js";

export type UserAdminRepository = {
  list(filter: { search?: string; skip: number; limit: number }): Promise<{ items: (PublicUser & { createdAt: Date })[]; total: number }>;
  findById(id: string): Promise<(PublicUser & { createdAt: Date }) | null>;
  setRole(id: string, role: UserRole): Promise<PublicUser & { createdAt: Date }>;
};

export type UserAdminService = ReturnType<typeof createUserAdminService>;

export function createUserAdminService({ users }: { users: UserAdminRepository }) {
  return {
    async list(filter: { search?: string; skip: number; limit: number; page: number }) {
      const search = filter.search?.trim() || undefined;
      const { items, total } = await users.list({ search, skip: filter.skip, limit: filter.limit });
      return { items, meta: buildMeta(filter.page, filter.limit, total) };
    },

    /** Admins cannot change their own role, so the last admin can never lock everyone out. */
    async setRole(actorId: string, targetId: string, role: UserRole) {
      if (actorId === targetId) throw AppError.forbidden("You cannot change your own role");
      if (!(await users.findById(targetId))) throw AppError.notFound("User not found");
      return users.setRole(targetId, role);
    },
  };
}
