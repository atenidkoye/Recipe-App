
import { Router } from "express";

import {
  getCategories,
  getCategory,
  createCategory
} from "./categories.controller.js";

import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

// Retrieves all categories.
router.get("/", getCategories);

// Retrieves a specific category by its ID.
router.get("/:id", getCategory);

// Creates a new category; authentication is required.
router.post(
  "/",
  authMiddleware,
  createCategory
);

export default router;
