
import type { Request, Response } from "express";
import type { AuthRequest } from "../../middleware/authMiddleware.js";
import { ingredientsService } from "./ingredients.service.js";
import { HTTP_STATUS } from "../../utils/http-status.js";

// Creates an ingredient for a recipe owned by the authenticated user.
export const createIngredient = (
  req: AuthRequest,
  res: Response
) => {
  const ingredient = ingredientsService.create(
    req.userId!,
    Number(req.params.recipeId),
    req.body
  );

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Ingredient created successfully",
    data: ingredient,
  });
};

// Retrieves all ingredients belonging to a specific recipe.
export const getIngredients = (
  req: Request,
  res: Response
) => {
  const ingredients = ingredientsService.getByRecipeId(
    Number(req.params.recipeId)
  );

  return res.status(HTTP_STATUS.OK).json({
    message: "Ingredients retrieved successfully",
    data: ingredients,
  });
};

// Deletes an ingredient after verifying ownership of its recipe.
export const deleteIngredient = (
  req: AuthRequest,
  res: Response
) => {
  ingredientsService.delete(
    req.userId!,
    Number(req.params.id)
  );

  return res.status(HTTP_STATUS.OK).json({
    message: "Ingredient deleted successfully",
  });
};
