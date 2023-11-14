import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { changeProductOrderStatus, createCheckoutSession, createPaymentIntent, createProductOrder, deleteProductOrder, getProductOrderByBuyer, getProductOrderBySeller, getProductOrders, getStripePublicKey, cancelOrder, orderSuccess } from "../controllers/product.order.controller.js";
const router = express.Router();

router.get("/get-config", authMiddleware, getStripePublicKey);
router.post("/create-payment-intent", authMiddleware, createPaymentIntent);
router.post("/create-product-order", authMiddleware, createProductOrder);
router.get("/get-product-orders", authMiddleware, getProductOrders);
router.get("/get-product-order-by-buyer/:id", authMiddleware, getProductOrderByBuyer);
router.get("/get-product-order-by-seller/:id", authMiddleware, getProductOrderBySeller)
router.delete("/delete-product-order/:id", authMiddleware, deleteProductOrder);
router.put("/change-product-order-status/:id", authMiddleware, changeProductOrderStatus);
router.post("/create-checkout-session", authMiddleware, createCheckoutSession);
router.put("/order-success/:id", authMiddleware, orderSuccess);
router.put("/cancel-order/:id", authMiddleware, cancelOrder);

export default router;