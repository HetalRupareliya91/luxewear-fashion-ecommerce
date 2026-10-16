import { Router } from "express";
import healthRoutes from "./health.routes.js";
import productRoutes from "../modules/products/product.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import couponRoutes from "../modules/coupons/coupon.routes.js";
import { adminOrderRoutes, checkoutRoutes, orderRoutes } from "../modules/orders/order.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";
import reviewRoutes from "../modules/reviews/review.routes.js";
import wishlistRoutes from "../modules/wishlist/wishlist.routes.js";
import userAdminRoutes from "../modules/users/user.routes.js";
import productAdminRoutes from "../modules/products/product.admin.routes.js";
import analyticsRoutes from "../modules/analytics/analytics.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/products", productRoutes);
router.use("/auth", authRoutes);
router.use("/coupons", couponRoutes);
router.use("/orders", orderRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/admin/orders", adminOrderRoutes);
router.use("/payments", paymentRoutes);
router.use("/reviews", reviewRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/admin/users", userAdminRoutes);
router.use("/admin/products", productAdminRoutes);
router.use("/admin", analyticsRoutes);

export default router;