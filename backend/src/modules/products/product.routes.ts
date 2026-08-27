import { Router } from "express";
import {
  listCategories,
  listProducts,
  showProduct,
} from "./product.controller.js";

const router = Router();

router.get("/categories", listCategories);
router.get("/", listProducts);
router.get("/:slug", showProduct);

export default router;