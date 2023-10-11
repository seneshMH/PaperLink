import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import { register, login, getCurrentUser, getAllUsers, updateUserStatus, getUserById, giveRating, uploadProfilePicture } from "../controllers/user.controller.js";
import upload from "../config/multer.config.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/upload-profile-picture', upload, uploadProfilePicture);

router.get('/get-current-user', authMiddleware, getCurrentUser);
router.get('/get-all-users', authMiddleware, getAllUsers);
router.put('/update-user-status/:id', authMiddleware, updateUserStatus);
router.get('/get-user-by-id/:id', authMiddleware, getUserById);
router.put('/give-rating-to-user/:id', authMiddleware, giveRating);

export default router;