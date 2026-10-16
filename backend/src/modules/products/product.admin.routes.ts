import { env } from "../../config/env.js";
import { createProductAdminService } from "./product.admin.js";
import { prismaProductAdminRepository } from "./product.admin.repository.js";
import { createProductAdminRouter } from "./product.admin.router.js";

export default createProductAdminRouter({ service: createProductAdminService({ products: prismaProductAdminRepository }), secret: env.jwtSecret });
