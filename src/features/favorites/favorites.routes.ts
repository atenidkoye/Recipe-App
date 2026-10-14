import { Router } from "express";

import {
  addFavourite,
  removeFavourite,
  getMyFavourites,
  checkFavourite
} from "./favorites.controller.js";

import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

// Retrieves all favourites belonging to the authenticated user.
router.get(
  "/",
  authMiddleware,
  getMyFavourites
);

// Checks whether a specific recipe is in the user's favourites.
router.get(
  "/:recipeId",
  authMiddleware,
  checkFavourite
);

// Adds a recipe to the user's favourites.
router.post(
  "/:recipeId",
  authMiddleware,
  addFavourite
);

// Removes a recipe from the user's favourites.
router.delete(
  "/:recipeId",
  authMiddleware,
  removeFavourite
);

export default router;