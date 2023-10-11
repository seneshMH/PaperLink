import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, updateProductStatus, deleteProductImage, uploadProductImage, getLatestProducts, giveRating } from "../controllers/product.controller.js";
import upload from "../config/multer.config.js";


const router = express.Router();

router.post("/add-product", authMiddleware, addProduct);
router.post("/get-products", authMiddleware, getAllProducts);
router.put("/edit-product/:id", authMiddleware, updateProduct);
router.get("/get-product-by-id/:id", authMiddleware, getProductById);
router.delete("/delete-product/:id", authMiddleware, deleteProduct);
router.put("/update-product-status/:id", authMiddleware, updateProductStatus);
router.post("/upload-product-images", authMiddleware, upload, uploadProductImage);
router.post("/delete-product-image", authMiddleware, deleteProductImage);
router.get("/get-latest-products", getLatestProducts);
router.put('/give-rating-to-product/:id', authMiddleware, giveRating);

export default router;