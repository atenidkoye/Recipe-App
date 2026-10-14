import { favouritesRepository } from "./favorites.repository.js";
import { recipesRepository } from "../recipes/recipes.repository.js";

// Handles business logic for managing a user's favourite recipes.
export const favouritesService = {
  // Adds a recipe to favourites after checking it exists and is not already saved.
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

  // Removes a recipe from favourites or throws an error if it is not found.
  remove(userId: number, recipeId: number) {
    const removed = favouritesRepository.remove(
      userId,
      recipeId
    );

    if (!removed) {
      throw new Error("Favourite not found");
    }
  },

  // Retrieves all favourite recipes belonging to a specific user.
  getMyFavourites(userId: number) {
    return favouritesRepository.findByUserId(userId);
  },

  // Checks whether a recipe is already in the user's favourites.
  checkFavourite(userId: number, recipeId: number) {
    const favourite = favouritesRepository.findOne(
      userId,
      recipeId
    );

    return !!favourite;
  }
};
