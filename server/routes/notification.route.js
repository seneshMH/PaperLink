import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { addNotification, deleteNotification, getNotificationsByUserId, readAllNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.post('/notify', authMiddleware, addNotification);
router.get('/get-all-notifications', authMiddleware, getNotificationsByUserId);
router.delete('/delete-notification/:id', authMiddleware, deleteNotification);
router.put('/read-all-notifications', authMiddleware, readAllNotifications);

export default router;