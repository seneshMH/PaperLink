import express from "express";
import { addAdvertisement, deleteAdvertisement, getAdvertisementById, getAllAdvertisements, updateAdvertisement, updateAdvertisementStatus } from "../controllers/advertisement.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/add-advertisement", authMiddleware, addAdvertisement);
router.post("/get-advertisements", authMiddleware, getAllAdvertisements);
router.put("/edit-advertisement/:id", authMiddleware, updateAdvertisement);
router.get("/get-advertisement-by-id/:id", authMiddleware, getAdvertisementById);
router.delete("/delete-advertisement/:id", authMiddleware, deleteAdvertisement);
router.put("/update-advertisement-status/:id", authMiddleware, updateAdvertisementStatus);

export default router;