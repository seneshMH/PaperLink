import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { addBid, deleteBid, getAllBids, getBidsByBuyer, changeBidPaidStatus, createCheckoutSession, changeBidStatus } from "../controllers/bid.controller.js";

const router = express.Router();

router.post("/add-bid", authMiddleware, addBid);
router.post("/get-bids", authMiddleware, getAllBids);
router.delete("/delete-bid/:id", authMiddleware, deleteBid);
router.put("/change-bid-status/:id", authMiddleware, changeBidStatus);
router.put("/change-bid-paid-status", authMiddleware, changeBidPaidStatus);
router.post("/create-checkout-session", authMiddleware, createCheckoutSession);
router.get("/get-bids-by-buyer-id/:id", authMiddleware, getBidsByBuyer);

export default router;