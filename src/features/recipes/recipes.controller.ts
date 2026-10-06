import { Request, Response } from "express";
import { recipesService } from "./recipes.service.js";
import { AuthRequest } from "../../middleware/authMiddleware.js";

export const createRecipe = (req: AuthRequest, res: Response) => {
  try {
    const recipe = recipesService.create(
      req.userId!,
      req.body
    );

    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Could not create recipe"
    });
  }
};

export const getRecipes = (_req: Request, res: Response) => {
  try {
    const recipes = recipesService.getAll();

    res.status(200).json(recipes);
  } catch {
    res.status(500).json({
      message: "Could not get recipes"
    });
  }
};

export const getRecipe = (req: Request, res: Response) => {
  try {
    const recipe = recipesService.getById(
      Number(req.params.id)
    );

    res.status(200).json(recipe);
  } catch (error) {
    res.status(404).json({
      message: error instanceof Error
        ? error.message
        : "Recipe not found"
    });
  }
};

export const getMyRecipes = (
  req: AuthRequest,
  res: Response
) => {
  try {
    const recipes = recipesService.getMyRecipes(
      req.userId!
    );

    res.status(200).json(recipes);
  } catch {
    res.status(500).json({
      message: "Could not get your recipes"
    });
  }
};

export const updateRecipe = (
  req: AuthRequest,
  res: Response
) => {
  try {
    const recipe = recipesService.update(
      Number(req.params.id),
      req.userId!,
      req.body
    );

    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Could not update recipe"
    });
  }
};

export const deleteRecipe = (
  req: AuthRequest,
  res: Response
) => {
  try {
    recipesService.delete(
      Number(req.params.id),
      req.userId!
    );

    res.status(200).json({
      message: "Recipe deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Could not delete recipe"
    });
  }
};