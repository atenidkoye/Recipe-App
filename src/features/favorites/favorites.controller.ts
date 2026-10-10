import { Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware.js";
import { favouritesService } from "./favorite.service.js";

export const addFavourite = (
  req: AuthRequest,
  res: Response
) => {
  try {
    favouritesService.add(
      req.userId!,
      Number(req.params.recipeId)
    );

    res.status(201).json({
      message: "Recipe added to favourites"
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Could not add favourite"
    });
  }
};

export const removeFavourite = (
  req: AuthRequest,
  res: Response
) => {
  try {
    favouritesService.remove(
      req.userId!,
      Number(req.params.recipeId)
    );

    res.status(200).json({
      message: "Recipe removed from favourites"
    });
  } catch (error) {
    res.status(404).json({
      message: error instanceof Error
        ? error.message
        : "Favourite not found"
    });
  }
};

export const getMyFavourites = (
  req: AuthRequest,
  res: Response
) => {
  try {
    const favourites =
      favouritesService.getMyFavourites(
        req.userId!
      );

    res.status(200).json(favourites);
  } catch {
    res.status(500).json({
      message: "Could not get favourites"
    });
  }
};

export const checkFavourite = (
  req: AuthRequest,
  res: Response
) => {
  try {
    const isFavourite =
      favouritesService.checkFavourite(
        req.userId!,
        Number(req.params.recipeId)
      );

    res.status(200).json({
      isFavourite
    });
  } catch {
    res.status(500).json({
      message: "Could not check favourite"
    });
  }
};