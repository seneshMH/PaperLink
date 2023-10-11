import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import { createBankAccount, getStripePublishableKey, createPaymentDetails, getPaymentDetails, createStripeAccount, createStripeAccountLink, addBankAccountToStripeAccount, addCardToStripeAccount, transferMoneyToStripeAccount } from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/get-stripe-publishable-key", authMiddleware, getStripePublishableKey);
router.post("/create-payment-details", authMiddleware, createPaymentDetails);
router.post("/get-payment-details", authMiddleware, getPaymentDetails);
router.post("/create-bank-account", authMiddleware, createBankAccount);
router.post("/create-stripe-account", authMiddleware, createStripeAccount);
router.post("/create-stripe-account-link", authMiddleware, createStripeAccountLink);
router.post("/add-bank-account-to-stripe-account", authMiddleware, addBankAccountToStripeAccount);
router.post("/add-card-to-stripe-account", authMiddleware, addCardToStripeAccount);
router.post("/transfer-money-to-stripe-account", authMiddleware, transferMoneyToStripeAccount);

export default router;