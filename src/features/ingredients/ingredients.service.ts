
import { ingredientsRepository } from "./ingredients.repository.js";
import { recipesRepository } from "../recipes/recipes.repository.js";
import type { CreateIngredientInput } from "./ingredients.types.js";

export const ingredientsService = {
  create(
    userId: number,
    recipeId: number,
    input: CreateIngredientInput
  ) {
    if (!input.name?.trim()) {
      throw new Error("Ingredient name is required");
    }

    const recipe = recipesRepository.findById(recipeId);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (recipe.user_id !== userId) {
      throw new Error("You are not authorized to modify this recipe");
    }

    return ingredientsRepository.create(recipeId, {
      ...input,
      name: input.name.trim(),
    });
  },

  getByRecipeId(recipeId: number) {
    return ingredientsRepository.findByRecipeId(recipeId);
  },

  delete(userId: number, ingredientId: number) {
    const ingredient = ingredientsRepository.findById(ingredientId);

    if (!ingredient) {
      throw new Error("Ingredient not found");
    }

    const recipe = recipesRepository.findById(ingredient.recipe_id);

    if (!recipe || recipe.user_id !== userId) {
      throw new Error("You are not authorized to delete this ingredient");
    }

    const deleted = ingredientsRepository.delete(ingredientId);

    if (!deleted) {
      throw new Error("Ingredient not found");
    }

    return true;
  },
};
