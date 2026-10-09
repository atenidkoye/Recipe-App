import { favouritesRepository } from "./favorites.repository.js";
import { recipesRepository } from "../recipes/recipes.repository.js";

export const favouritesService = {
  add(userId: number, recipeId: number) {
    const recipe = recipesRepository.findById(recipeId);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    const existing = favouritesRepository.findOne(
      userId,
      recipeId
    );

    if (existing) {
      throw new Error("Recipe is already a favourite");
    }

    favouritesRepository.add(userId, recipeId);
  },

  remove(userId: number, recipeId: number) {
    const removed = favouritesRepository.remove(
      userId,
      recipeId
    );

    if (!removed) {
      throw new Error("Favourite not found");
    }
  },

  getMyFavourites(userId: number) {
    return favouritesRepository.findByUserId(userId);
  },

  checkFavourite(userId: number, recipeId: number) {
    const favourite = favouritesRepository.findOne(
      userId,
      recipeId
    );

    return !!favourite;
  }
};