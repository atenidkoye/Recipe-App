
import { Alert } from "react-native";
import {
  getDatabase,
  getIngredients,
  getRecipeCategories,
  getFavouriteRecipeIds,
  addFavourite,
  removeFavourite
} from "../database/database";

import Recipe from "./types/recipe";

// Retrieves a user's recipes from the local SQLite database.
export const readUserRecipes = async (setRecipes, userId = 0) => {
  try {
    // Opens the local database connection.
    const db = await getDatabase();

    // Retrieves recipes belonging to the specified user, newest first.
    const recipes = await db.getAllAsync(
      `SELECT id, user_id, title, description, instructions,
              cooking_time, servings, is_public
       FROM recipes
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      userId
    );

    // Retrieves the IDs of recipes marked as favourites by this user.
    const favouriteIds = await getFavouriteRecipeIds(userId);

    // Loads each recipe's ingredients, categories, and favourite status.
    const recipesWithDetails = await Promise.all(
      recipes.map(async (recipe) => ({
        ...recipe,
        ingredients: await getIngredients(recipe.id),
        categories: await getRecipeCategories(recipe.id),
        isFavourite: favouriteIds.includes(recipe.id),
      }))
    );

    // Updates the screen with the retrieved recipes.
    setRecipes(recipesWithDetails);
    return recipesWithDetails;
  } catch (error) {
    // Logs the error and returns an empty list if retrieval fails.
    console.error("Failed to read local recipes:", error);
    setRecipes([]);
    return [];
  }
};

// Saves a recipe locally by inserting a new record or updating an existing one.
export const saveLocalRecipe = async (recipe, userId = 0) => {
  // Opens the database and generates timestamps for the recipe.
  const db = await getDatabase();
  const now = new Date().toISOString();
  let recipeId = recipe.id;

  // Groups the recipe and its related changes into one transaction.
  await db.withTransactionAsync(async () => {
    let existing = null;

    // Checks whether the recipe already belongs to this user.
    if (recipeId != null) {
      existing = await db.getFirstAsync(
        "SELECT id FROM recipes WHERE id = ? AND user_id = ?",
        recipeId,
        userId
      );
    }

    if (existing) {
      // Updates the existing recipe's main information.
      await db.runAsync(
        `UPDATE recipes
         SET title = ?, description = ?, instructions = ?,
             cooking_time = ?, servings = ?, is_public = ?,
             updated_at = ?, cached_at = CURRENT_TIMESTAMP
         WHERE id = ? AND user_id = ?`,
        recipe.title,
        recipe.description || null,
        recipe.instructions || "",
        recipe.cooking_time || 0,
        recipe.servings || 1,
        Number(recipe.is_public),
        now,
        recipeId,
        userId
      );

      // Removes the old ingredients before saving the current ones.
      await db.runAsync(
        "DELETE FROM ingredients WHERE recipe_id = ?",
        recipeId
      );

      // Removes the old category links before recreating them.
      await db.runAsync(
        "DELETE FROM recipe_categories WHERE recipe_id = ?",
        recipeId
      );
    } else {
      // Inserts a new recipe and retrieves its generated database ID.
      const result = await db.runAsync(
        `INSERT INTO recipes (
           user_id, title, description, instructions,
           cooking_time, servings, is_public,
           created_at, updated_at
         )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        userId,
        recipe.title,
        recipe.description || null,
        recipe.instructions || "",
        recipe.cooking_time || 0,
        recipe.servings || 1,
        Number(recipe.is_public),
        now,
        now
      );

      recipeId = result.lastInsertRowId;
    }

    // Saves each ingredient and converts valid quantities to numbers.
    for (const ingredient of recipe.ingredients || []) {
      const rawQuantity = ingredient.quantity;
      const quantity =
        rawQuantity === "" || rawQuantity == null
          ? null
          : Number(rawQuantity);

      await db.runAsync(
        `INSERT INTO ingredients (recipe_id, name, quantity, unit)
         VALUES (?, ?, ?, ?)`,
        recipeId,
        ingredient.name,
        quantity !== null && Number.isFinite(quantity) ? quantity : null,
        ingredient.unit || null
      );
    }

    // Saves category names and links each category to the recipe.
    for (const category of recipe.categories || []) {
      // Skips categories without a name.
      if (!category.name) continue;

      // Adds the category if it does not already exist.
      await db.runAsync(
        "INSERT OR IGNORE INTO categories (name) VALUES (?)",
        category.name
      );

      // Retrieves the database ID for the saved category.
      const savedCategory = await db.getFirstAsync(
        "SELECT id FROM categories WHERE name = ?",
        category.name
      );

      if (savedCategory) {
        // Links the category to the recipe without duplicating the link.
        await db.runAsync(
          `INSERT OR IGNORE INTO recipe_categories (recipe_id, category_id)
           VALUES (?, ?)`,
          recipeId,
          savedCategory.id
        );
      }
    }
  });

  // Returns the local database ID of the saved recipe.
  return recipeId;
};

// switcher for favourite recipe in local db
export const toggleLocalFavourite = async (userId, recipeId, isFavourite) => {
  try {
    if (isFavourite) {
      await removeFavourite(userId, recipeId);
      return false;
    } else {
      await addFavourite(userId, recipeId);
      return true;
    }
  } catch (err) {
    Alert.alert("Error", err);
    return isFavourite;
  }
}

// delete recipe locally
export const deleteLocalRecipe = async (recipeId) => {
  try {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM recipes WHERE id = ?", recipeId);
    return true;
  } catch (err) {
    Alert.alert("Error", err);
    return false;
  }
}
