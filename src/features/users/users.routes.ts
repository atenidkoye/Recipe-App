import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile
} from "./users.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

// All account-management routes require authentication.
router.use(authMiddleware);

// Retrieves the authenticated user's profile.
router.get("/me", getMyProfile);

// Updates the authenticated user's profile.
router.put("/me", updateMyProfile);

export default router;