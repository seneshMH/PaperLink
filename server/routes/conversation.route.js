import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { findOrCreateConversation, getAllConversations, getSingleConversation, updateConversation } from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/find-or-create-conversation", authMiddleware, findOrCreateConversation);
router.put("/update-conversation", authMiddleware, updateConversation);
router.get("/get-single-conversation/:id", authMiddleware, getSingleConversation);
router.get("/get-conversations", authMiddleware, getAllConversations);

export default router;