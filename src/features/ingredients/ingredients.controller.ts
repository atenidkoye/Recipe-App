import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware.js";
import { ingredientsService } from "./ingredients.service.js";

// Creates an ingredient for a recipe owned by the authenticated user.
export const createIngredient = (
  req: AuthRequest,
  res: Response
) => {
  try {
    const ingredient = ingredientsService.create(
      req.userId!,
      Number(req.params.recipeId),
      req.body
    );

    res.status(201).json(ingredient);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Could not create ingredient"
    });
  }
};

// Retrieves all ingredients belonging to a specific recipe.
export const getIngredients = (
  req: Request,
  res: Response
) => {
  try {
    const ingredients =
      ingredientsService.getByRecipeId(
        Number(req.params.recipeId)
      );

    res.status(200).json(ingredients);
  } catch {
    res.status(500).json({
      message: "Could not get ingredients"
    });
  }
};

// Deletes an ingredient after verifying the user's ownership of its recipe.
export const deleteIngredient = (
  req: AuthRequest,
  res: Response
) => {
  try {
    ingredientsService.delete(
      req.userId!,
      Number(req.params.id)
    );

    res.status(200).json({
      message: "Ingredient deleted successfully"
    });
  } catch (error) {
    res.status(404).json({
      message: error instanceof Error
        ? error.message
        : "Ingredient not found"
    });
  }
};
