import { recipeCategoriesRepository } from "./recipeCategories.repository.js";
import { categoriesRepository } from "./categories.repository.js";
import { recipesRepository } from "../recipes/recipes.repository.js";

export const recipeCategoriesService = {
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

  getForRecipe(recipeId: number) {
    const recipe = recipesRepository.findById(recipeId);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return recipeCategoriesRepository.getCategoriesForRecipe(
      recipeId
    );
  },

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