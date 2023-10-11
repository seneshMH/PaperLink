import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { sendMail } from "../controllers/mail.controller.js";

const router = express.Router();

router.post("/send-mail", authMiddleware, sendMail);

export default router;