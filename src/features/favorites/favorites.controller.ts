
import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authMiddleware.js";
import { favouritesService } from "./favorite.service.js";
import { HTTP_STATUS } from "../../utils/http-status.js";
import { AppError } from "../../utils/app-error.js";

// Adds a recipe to the authenticated user's favourites.
export const addFavourite = (
  req: AuthRequest,
  res: Response
) => {
  favouritesService.add(
    req.userId!,
    Number(req.params.recipeId)
  );

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Recipe added to favourites",
  });
};

// Removes a recipe from the authenticated user's favourites.
export const removeFavourite = (
  req: AuthRequest,
  res: Response
) => {
  favouritesService.remove(
    req.userId!,
    Number(req.params.recipeId)
  );

  return res.status(HTTP_STATUS.OK).json({
    message: "Recipe removed from favourites",
  });
};

// Retrieves all favourite recipes belonging to the authenticated user.
export const getMyFavourites = (
  req: AuthRequest,
  res: Response
) => {
  const favourites = favouritesService.getMyFavourites(
    req.userId!
  );

  return res.status(HTTP_STATUS.OK).json({
    message: "Favourites retrieved successfully",
    data: favourites,
  });
};

// Checks whether a recipe is in the authenticated user's favourites.
export const checkFavourite = (
  req: AuthRequest,
  res: Response
) => {
  const isFavourite = favouritesService.checkFavourite(
    req.userId!,
    Number(req.params.recipeId)
  );

  return res.status(HTTP_STATUS.OK).json({
    message: "Favourite status retrieved successfully",
    data: {
      isFavourite,
    },
  });
};
