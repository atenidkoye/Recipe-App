import { Router } from "express";

import {
  createRecipe,
  getRecipes,
  getRecipe,
  getMyRecipes,
  updateRecipe,
  deleteRecipe
} from "./recipes.controller.js";

import {
  addCategoryToRecipe,
  getRecipeCategories,
  removeCategoryFromRecipe
} from "../categories/recipecategories.controller.js";

import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/", getRecipes);

router.get("/:id", getRecipe);

router.get(
  "/user/me",
  authMiddleware,
  getMyRecipes
);

router.post(
  "/",
  authMiddleware,
  createRecipe
);

router.post(
  "/:recipeId/categories/:categoryId",
  authMiddleware,
  addCategoryToRecipe
);

router.get(
  "/:recipeId/categories",
  getRecipeCategories
);

router.delete(
  "/:recipeId/categories/:categoryId",
  authMiddleware,
  removeCategoryFromRecipe
);

router.put(
  "/:id",
  authMiddleware,
  updateRecipe
);

router.delete(
  "/:id",
  authMiddleware,
  deleteRecipe
);

export default router;