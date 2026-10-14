import { recipesRepository } from "./recipes.repository.js";
import type {
  CreateRecipeInput,
  UpdateRecipeInput
} from "./recipes.types.js";

export const recipesService = {
  // Validate the required fields before asking the repository to create a recipe.
  create(userId: number, input: CreateRecipeInput) {
    if (!input.title.trim() || !input.instructions.trim()) {
      throw new Error("Title and instructions are required");
    }

    // Associate the new recipe with the authenticated user who created it.
    return recipesRepository.create(userId, input);
  },

  // Retrieve the collection of recipes provided by the repository.
  getAll() {
    return recipesRepository.findAll();
  },

  // Find a recipe by its ID and report an error if it does not exist.
  getById(id: number) {
    const recipe = recipesRepository.findById(id);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return recipe;
  },

  // Retrieve all recipes associated with a particular user's ID.
  getMyRecipes(userId: number) {
    return recipesRepository.findByUserId(userId);
  },

  // Update a recipe only when it exists and belongs to the requesting user.
  update(
    id: number,
    userId: number,
    input: UpdateRecipeInput
  ) {
    // Check that the recipe exists before attempting to update it.
    const recipe = recipesRepository.findById(id);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    // Prevent users from changing recipes owned by other accounts.
    if (recipe.user_id !== userId) {
      throw new Error("You can only update your own recipes");
    }

    // Pass both IDs to the repository so the update is restricted to this owner.
    const updated = recipesRepository.update(
      id,
      userId,
      input
    );

    // Check whether the repository successfully updated the recipe.
    if (!updated) {
      throw new Error("Recipe could not be updated");
    }

    // Return the updated recipe from the database.
    return recipesRepository.findById(id);
  },

  // Delete a recipe only when it exists and belongs to the requesting user.
  delete(id: number, userId: number) {
    // Find the recipe first so its existence and ownership can be checked.
    const recipe = recipesRepository.findById(id);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    // Prevent users from deleting recipes owned by other accounts.
    if (recipe.user_id !== userId) {
      throw new Error("You can only delete your own recipes");
    }

    // Pass both IDs to the repository to restrict deletion to the recipe owner.
    const deleted = recipesRepository.delete(id, userId);

    // Report an error if the repository did not delete the recipe.
    if (!deleted) {
      throw new Error("Recipe could not be deleted");
    }

    // Return true to indicate that deletion succeeded.
    return true;
  }
};