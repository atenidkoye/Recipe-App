import { Router } from "express";

import {
  createIngredient,
  getIngredients,
  deleteIngredient
} from "./ingredients.controller.js";

import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/recipe/:recipeId",
  getIngredients
);

router.post(
  "/recipe/:recipeId",
  authMiddleware,
  createIngredient
);

router.delete(
  "/:id",
  authMiddleware,
  deleteIngredient
);

export default router;