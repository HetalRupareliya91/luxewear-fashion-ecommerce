import { env } from "../../config/env.js";
import { prismaWishlistRepository } from "./wishlist.repository.js";
import { createWishlistRouter } from "./wishlist.router.js";
import { createWishlistService } from "./wishlist.service.js";

export default createWishlistRouter({ service: createWishlistService({ wishlist: prismaWishlistRepository }), secret: env.jwtSecret });
