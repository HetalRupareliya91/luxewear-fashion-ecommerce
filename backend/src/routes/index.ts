import { Router } from "express";
import healthRoutes from "./health.routes.js";
import productRoutes from "../modules/products/product.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/products", productRoutes);
router.use("/auth", authRoutes);

export default router;