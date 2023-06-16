import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, updateProductStatus, uploadProductImage } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/add-product", authMiddleware, addProduct);
router.post("/get-products", authMiddleware, getAllProducts); 
router.put("/edit-product/:id", authMiddleware, updateProduct);
router.get("/get-product-by-id/:id", authMiddleware,getProductById);
router.delete("/delete-product/:id", authMiddleware, deleteProduct);
router.put("/update-product-status/:id", authMiddleware, updateProductStatus);
router.post("/upload-product-image", authMiddleware, uploadProductImage);

export default router;