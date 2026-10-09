import { Router } from "express";

import {
  addFavourite,
  removeFavourite,
  getMyFavourites,
  checkFavourite
} from "./favorites.controller.js";

import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  getMyFavourites
);

router.get(
  "/:recipeId",
  authMiddleware,
  checkFavourite
);

router.post(
  "/:recipeId",
  authMiddleware,
  addFavourite
);

router.delete(
  "/:recipeId",
  authMiddleware,
  removeFavourite
);

export default router;