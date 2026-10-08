import { Request, Response } from "express";
import { recipeCategoriesService } from "./recipeCategories.service.js";

export const addCategoryToRecipe = (
  req: Request,
  res: Response
) => {
  try {
    recipeCategoriesService.add(
      Number(req.params.recipeId),
      Number(req.params.categoryId)
    );

    res.status(201).json({
      message: "Category added to recipe"
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Could not add category"
    });
  }
};

export const getRecipeCategories = (
  req: Request,
  res: Response
) => {
  try {
    const categories =
      recipeCategoriesService.getForRecipe(
        Number(req.params.recipeId)
      );

    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({
      message: error instanceof Error
        ? error.message
        : "Could not get categories"
    });
  }
};

export const removeCategoryFromRecipe = (
  req: Request,
  res: Response
) => {
  try {
    recipeCategoriesService.remove(
      Number(req.params.recipeId),
      Number(req.params.categoryId)
    );

    res.status(200).json({
      message: "Category removed from recipe"
    });
  } catch (error) {
    res.status(404).json({
      message: error instanceof Error
        ? error.message
        : "Could not remove category"
    });
  }
};