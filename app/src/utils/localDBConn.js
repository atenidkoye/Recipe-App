
import {
  getDatabase,
  getIngredients,
  getRecipeCategories,
  getFavouriteRecipeIds,
} from "../database/database";
import Recipe from "./types/recipe";
export const readUserRecipes = async (setRecipes, userId = 0) => {
  try {
    const db = await getDatabase();

    const recipes = await db.getAllAsync(
      `SELECT id, user_id, title, description, instructions,
              cooking_time, servings, is_public
       FROM recipes
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      userId
    );

    const favouriteIds = await getFavouriteRecipeIds(userId);

    const recipesWithDetails = await Promise.all(
      recipes.map(async (recipe) => ({
        ...recipe,
        ingredients: await getIngredients(recipe.id),
        categories: await getRecipeCategories(recipe.id),
        isFavourite: favouriteIds.includes(recipe.id),
      }))
    );

    setRecipes(recipesWithDetails);
    return recipesWithDetails;
  } catch (error) {
    console.error("Failed to read local recipes:", error);
    setRecipes([]);
    return [];
  }
};

export const saveLocalRecipe = async (recipe, userId = 0) => {
  const db = await getDatabase();
  const now = new Date().toISOString();
  let recipeId = recipe.id;

  await db.withTransactionAsync(async () => {
    let existing = null;

    if (recipeId != null) {
      existing = await db.getFirstAsync(
        "SELECT id FROM recipes WHERE id = ? AND user_id = ?",
        recipeId,
        userId
      );
    }

    if (existing) {
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

      await db.runAsync(
        "DELETE FROM ingredients WHERE recipe_id = ?",
        recipeId
      );

      await db.runAsync(
        "DELETE FROM recipe_categories WHERE recipe_id = ?",
        recipeId
      );
    } else {
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

    for (const category of recipe.categories || []) {
      if (!category.name) continue;

      await db.runAsync(
        "INSERT OR IGNORE INTO categories (name) VALUES (?)",
        category.name
      );

      const savedCategory = await db.getFirstAsync(
        "SELECT id FROM categories WHERE name = ?",
        category.name
      );

      if (savedCategory) {
        await db.runAsync(
          `INSERT OR IGNORE INTO recipe_categories (recipe_id, category_id)
           VALUES (?, ?)`,
          recipeId,
          savedCategory.id
        );
      }
    }
  });

  return recipeId;
};
