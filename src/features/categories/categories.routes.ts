import { Router } from "express";

import {
  getCategories,
  getCategory,
  createCategory
} from "./categories.controller.js";

import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/", getCategories);

router.get("/:id", getCategory);

router.post(
  "/",
  authMiddleware,
  createCategory
);

export default router;