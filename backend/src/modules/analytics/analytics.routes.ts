import { env } from "../../config/env.js";
import { prismaAnalyticsRepository } from "./analytics.repository.js";
import { createAnalyticsRouter } from "./analytics.router.js";
import { createAnalyticsService } from "./analytics.service.js";

export default createAnalyticsRouter({ service: createAnalyticsService({ repo: prismaAnalyticsRepository }), secret: env.jwtSecret });
