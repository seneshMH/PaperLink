import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import { register, login, getCurrentUser, getAllUsers, updateUserStatus } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/get-current-user', authMiddleware, getCurrentUser);
router.get('/get-all-users', authMiddleware, getAllUsers);
router.put('/update-user-status/:id', authMiddleware, updateUserStatus);

export default router;