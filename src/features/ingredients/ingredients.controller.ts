import { Request, Response } from "express";
import { ingredientsService } from "./ingredients.service.js";

export const createIngredient = (
  req: Request,
  res: Response
) => {
  try {
    const ingredient = ingredientsService.create(
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

export const deleteIngredient = (
  req: Request,
  res: Response
) => {
  try {
    ingredientsService.delete(
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