import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createMessage, deleteMessage, getMessagesByConversationId } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/create-message", authMiddleware, createMessage);
router.get("/get-messages/:id", authMiddleware, getMessagesByConversationId);
router.delete("/delete-message/:id", authMiddleware, deleteMessage);

export default router;