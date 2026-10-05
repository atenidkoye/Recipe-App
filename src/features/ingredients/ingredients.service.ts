import { ingredientsRepository } from "./ingredients.repository.js";
import type { CreateIngredientInput } from "./ingredients.types.js";

export const ingredientsService = {
  create(
    recipeId: number,
    input: CreateIngredientInput
  ) {
    if (!input.name) {
      throw new Error("Ingredient name is required");
    }

    return ingredientsRepository.create(
      recipeId,
      input
    );
  },

  getByRecipeId(recipeId: number) {
    return ingredientsRepository.findByRecipeId(
      recipeId
    );
  },

  delete(id: number) {
    const deleted = ingredientsRepository.delete(id);

    if (!deleted) {
      throw new Error("Ingredient not found");
    }

    return true;
  }
};