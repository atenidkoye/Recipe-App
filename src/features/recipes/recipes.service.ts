import { recipesRepository } from "./recipes.repository.js";
import type {
  CreateRecipeInput,
  UpdateRecipeInput
} from "./recipes.types.js";

export const recipesService = {
  create(userId: number, input: CreateRecipeInput) {
    if (!input.title || !input.instructions) {
      throw new Error("Title and instructions are required");
    }

    return recipesRepository.create(userId, input);
  },

  getAll() {
    return recipesRepository.findAll();
  },


  getById(id: number) {
    const recipe = recipesRepository.findById(id);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return recipe;
  },


  getMyRecipes(userId: number) {
    return recipesRepository.findByUserId(userId);
  },


  update(
    id: number,
    userId: number,
    input: UpdateRecipeInput
  ) {
    const recipe = recipesRepository.findById(id);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (recipe.user_id !== userId) {
      throw new Error("You can only update your own recipes");
    }

    const updated = recipesRepository.update(
      id,
      userId,
      input
    );

    if (!updated) {
      throw new Error("Recipe could not be updated");
    }

    return recipesRepository.findById(id);
  },

  
  delete(id: number, userId: number) {
    const recipe = recipesRepository.findById(id);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (recipe.user_id !== userId) {
      throw new Error("You can only delete your own recipes");
    }

    const deleted = recipesRepository.delete(id, userId);

    if (!deleted) {
      throw new Error("Recipe could not be deleted");
    }

    return true;
  }
};