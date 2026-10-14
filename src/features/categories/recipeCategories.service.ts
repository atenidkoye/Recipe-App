import { recipeCategoriesRepository } from "./recipeCategories.repository.js";
import { categoriesRepository } from "./categories.repository.js";
import { recipesRepository } from "../recipes/recipes.repository.js";

// Handles business logic for assigning and managing recipe categories.
export const recipeCategoriesService = {
  // Validates that both the recipe and category exist before linking them.
  add(recipeId: number, categoryId: number) {
    const recipe = recipesRepository.findById(recipeId);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    const category = categoriesRepository.findById(categoryId);

    if (!category) {
      throw new Error("Category not found");
    }

    recipeCategoriesRepository.add(recipeId, categoryId);
  },

  // Retrieves the categories assigned to a recipe after checking the recipe exists.
  getForRecipe(recipeId: number) {
    const recipe = recipesRepository.findById(recipeId);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return recipeCategoriesRepository.getCategoriesForRecipe(
      recipeId
    );
  },

  // Removes the link between a recipe and a category.
  remove(recipeId: number, categoryId: number) {
    const removed = recipeCategoriesRepository.remove(
      recipeId,
      categoryId
    );

    if (!removed) {
      throw new Error("Category relationship not found");
    }
  }
};
