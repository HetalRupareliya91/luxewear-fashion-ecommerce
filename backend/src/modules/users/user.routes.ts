import { env } from "../../config/env.js";
import { createUserAdminService } from "./user.admin.js";
import { prismaUserAdminRepository } from "./user.admin.repository.js";
import { createUserAdminRouter } from "./user.router.js";

export default createUserAdminRouter({ service: createUserAdminService({ users: prismaUserAdminRepository }), secret: env.jwtSecret });
