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

// Create a router to group all recipe-related API endpoints.
const router = Router();

// Retrieve the collection of publicly available recipes.
// Authentication is not required for this endpoint.
router.get("/", getRecipes);

// Retrieve a single recipe using its ID.
// Authentication is not required at the routing level.
router.get("/:id", getRecipe);

// Retrieve recipes belonging to the currently authenticated user.
// The middleware verifies the access token before the controller runs.
router.get(
  "/user/me",
  authMiddleware,
  getMyRecipes
);

// Create a new recipe for the authenticated user.
router.post(
  "/",
  authMiddleware,
  createRecipe
);

// Associate a category with a recipe.
// Authentication is required because this operation changes recipe data.
router.post(
  "/:recipeId/categories/:categoryId",
  authMiddleware,
  addCategoryToRecipe
);

// Retrieve the categories associated with a particular recipe.
// Authentication is not required at the routing level.
router.get(
  "/:recipeId/categories",
  getRecipeCategories
);

// Remove a category association from a recipe.
// Authentication is required because this operation changes data.
router.delete(
  "/:recipeId/categories/:categoryId",
  authMiddleware,
  removeCategoryFromRecipe
);

// Update an existing recipe.
// Authentication is required before the controller handles the request.
router.put(
  "/:id",
  authMiddleware,
  updateRecipe
);

// Delete an existing recipe.
// Authentication is required before the controller handles the request.
router.delete(
  "/:id",
  authMiddleware,
  deleteRecipe
);

// Export the router so the main Express application can mount these endpoints.
export default router;