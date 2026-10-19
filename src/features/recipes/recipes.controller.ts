
import type { Request, Response } from "express";
import { recipesService } from "./recipes.service.js";
import type { AuthRequest } from "../../middleware/authMiddleware.js";
import { HTTP_STATUS } from "../../utils/http-status.js";

// Create a new recipe for the authenticated user.
export const createRecipe = (req: AuthRequest, res: Response) => {
  const recipe = recipesService.create(req.userId!, req.body);

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Recipe created successfully",
    data: recipe,
  });
};

// Retrieve all recipes.
export const getRecipes = (_req: Request, res: Response) => {
  const recipes = recipesService.getAll();

  return res.status(HTTP_STATUS.OK).json({
    message: "Recipes retrieved successfully",
    data: recipes,
  });
};

// Retrieve a single recipe by ID.
export const getRecipe = (req: Request, res: Response) => {
  const recipe = recipesService.getById(Number(req.params.id));

  return res.status(HTTP_STATUS.OK).json({
    message: "Recipe retrieved successfully",
    data: recipe,
  });
};

// Retrieve recipes belonging to the authenticated user.
export const getMyRecipes = (req: AuthRequest, res: Response) => {
  const recipes = recipesService.getMyRecipes(req.userId!);

  return res.status(HTTP_STATUS.OK).json({
    message: "Your recipes retrieved successfully",
    data: recipes,
  });
};

// Update a recipe belonging to the authenticated user.
export const updateRecipe = (req: AuthRequest, res: Response) => {
  const recipe = recipesService.update(
    Number(req.params.id),
    req.userId!,
    req.body
  );

  return res.status(HTTP_STATUS.OK).json({
    message: "Recipe updated successfully",
    data: recipe,
  });
};

// Delete a recipe belonging to the authenticated user.
export const deleteRecipe = (req: AuthRequest, res: Response) => {
  recipesService.delete(
    Number(req.params.id),
    req.userId!
  );

  return res.status(HTTP_STATUS.OK).json({
    message: "Recipe deleted successfully",
  });
};
