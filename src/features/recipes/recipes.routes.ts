import { Router } from "express";

import {
  createRecipe,
  getRecipes,
  getRecipe,
  getMyRecipes,
  updateRecipe,
  deleteRecipe
} from "./recipes.controller.js";

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