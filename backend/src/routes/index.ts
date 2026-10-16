import { Router } from "express";
import healthRoutes from "./health.routes.js";
import productRoutes from "../modules/products/product.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import couponRoutes from "../modules/coupons/coupon.routes.js";
import { adminOrderRoutes, checkoutRoutes, orderRoutes } from "../modules/orders/order.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/products", productRoutes);
router.use("/auth", authRoutes);
router.use("/coupons", couponRoutes);
router.use("/orders", orderRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/admin/orders", adminOrderRoutes);
router.use("/payments", paymentRoutes);

export default router;