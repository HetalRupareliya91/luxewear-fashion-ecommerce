import type { Request, Response } from "express";
import {
  getCategories,
  getProductBySlug,
  getProducts,
} from "./product.service.js";

export async function listProducts(
  _req: Request,
  res: Response,
) {
  const products = await getProducts();

  res.status(200).json({
    success: true,
    data: products,
  });
}

export async function showProduct(
  req: Request,
  res: Response,
) {
  const { slug } = req.params;

  const slugParam = req.params.slug;

if (Array.isArray(slugParam)) {
  res.status(400).json({
    success: false,
    message: "Invalid product slug",
  });
  return;
}

const product = await getProductBySlug(slugParam);

  if (!product) {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: product,
  });
}

export async function listCategories(
  _req: Request,
  res: Response,
) {
  const categories = await getCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
}