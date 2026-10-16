import { env } from "../../config/env.js";
import { prismaUserRepository } from "../auth/auth.repository.js";
import { prismaReviewRepository } from "./review.repository.js";
import { createReviewRouter } from "./review.router.js";
import { createReviewService } from "./review.service.js";

const service = createReviewService({ reviews: prismaReviewRepository, users: prismaUserRepository });

export default createReviewRouter({ service, secret: env.jwtSecret });
