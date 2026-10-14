import { Router } from "express";

import {
  createIngredient,
  getIngredients,
  deleteIngredient
} from "./ingredients.controller.js";

import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

// Retrieves all ingredients belonging to a specific recipe.
router.get(
  "/recipe/:recipeId",
  getIngredients
);

// Adds an ingredient to a recipe; authentication is required.
router.post(
  "/recipe/:recipeId",
  authMiddleware,
  createIngredient
);

// Deletes an ingredient; authentication is required.
router.delete(
  "/:id",
  authMiddleware,
  deleteIngredient
);

export default router;