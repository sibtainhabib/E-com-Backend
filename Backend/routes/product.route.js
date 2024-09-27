import express, { Router } from "express";
import {
  allFeaturedProducts,
  allProducts,
  createProduct,
  productByCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(protectRoute, adminRoute, allProducts);
router.route("/featured").get(allFeaturedProducts);
router.route("/featured/:id").patch(toggleFeaturedProduct);
router.route("/").post(createProduct);
router.route("/category:category").get(productByCategory);

export default router;
