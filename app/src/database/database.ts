
import * as SQLite from "expo-sqlite";

// Defines the structure of an ingredient stored in the local database.
export type CachedIngredient = {
  id: number;
  recipe_id: number;
  name: string;
  quantity: number | null;
  unit: string | null;
};

// Defines the structure of a recipe category.
export type CachedCategory = {
  id: number;
  name: string;
};

// Represents a cached recipe together with its ingredients and categories.
export type RecipeWithDetails = CachedRecipe & {
  ingredients: CachedIngredient[];
  categories: CachedCategory[];
};

// Holds the database connection so it can be reused throughout the app.
let database: SQLite.SQLiteDatabase | null = null;

/**
 * Opens the local database and creates the required tables and indexes
 * if they do not already exist.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  // Reuse the existing connection if the database is already open.
  if (database) {
    return database;
  }

  // Opens or creates the SQLite database file.
  const db = await SQLite.openDatabaseAsync("recipe_mobile.db");

  try {
    // Enables foreign-key constraints and initializes the database schema.
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      -- Stores recipes cached from the server or created locally.
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        instructions TEXT NOT NULL,
        cooking_time INTEGER,
        servings INTEGER,
        is_public INTEGER NOT NULL DEFAULT 1
          CHECK (is_public IN (0, 1)),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        cached_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- Stores ingredients belonging to individual recipes.
      -- Deleting a recipe also deletes its ingredients.
      CREATE TABLE IF NOT EXISTS ingredients (
        id INTEGER PRIMARY KEY,
        recipe_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity REAL,
        unit TEXT,
        FOREIGN KEY (recipe_id)
          REFERENCES recipes(id) ON DELETE CASCADE
      );

      -- Stores the available recipe categories.
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );

      -- Links recipes and categories in a many-to-many relationship.
      CREATE TABLE IF NOT EXISTS recipe_categories (
        recipe_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        PRIMARY KEY (recipe_id, category_id),
        FOREIGN KEY (recipe_id)
          REFERENCES recipes(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id)
          REFERENCES categories(id) ON DELETE CASCADE
      );

      -- Stores the recipes each user has marked as favourites.
      CREATE TABLE IF NOT EXISTS favourites (
        user_id INTEGER NOT NULL,
        recipe_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, recipe_id),
        FOREIGN KEY (recipe_id)
          REFERENCES recipes(id) ON DELETE CASCADE
      );

      -- Stores one shopping list per user.
      CREATE TABLE IF NOT EXISTS shopping_lists (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- Stores the individual items in each shopping list.
      CREATE TABLE IF NOT EXISTS shopping_list_items (
        id INTEGER PRIMARY KEY,
        shopping_list_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity REAL,
        unit TEXT,
        is_purchased INTEGER NOT NULL DEFAULT 0
          CHECK (is_purchased IN (0, 1)),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (shopping_list_id)
          REFERENCES shopping_lists(id) ON DELETE CASCADE
      );

      -- Improves lookups by user, recipe, category, and shopping list.
      CREATE INDEX IF NOT EXISTS idx_recipes_user_id
        ON recipes(user_id);

      CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id
        ON ingredients(recipe_id);

      CREATE INDEX IF NOT EXISTS idx_recipe_categories_category_id
        ON recipe_categories(category_id);

      CREATE INDEX IF NOT EXISTS idx_favourites_recipe_id
        ON favourites(recipe_id);

      CREATE INDEX IF NOT EXISTS idx_shopping_items_list_id
        ON shopping_list_items(shopping_list_id);
    `);

    // Saves the connection for subsequent database operations.
    database = db;
    return db;
  } catch (error) {
    // Closes the connection if database initialization fails.
    await db.closeAsync();
    throw error;
  }
}

/**
 * Defines the fields stored for a cached recipe.
 */
export type CachedRecipe = {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  instructions: string;
  cooking_time: number | null;
  servings: number | null;
  is_public: number;
  created_at: string;
  updated_at: string;
};

/**
 * Inserts recipes into SQLite or updates existing records.
 * Uses a transaction so the batch is handled together.
 */
export async function cacheRecipes(
  recipes: CachedRecipe[]
): Promise<void> {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    for (const recipe of recipes) {
      await db.runAsync(
        `INSERT INTO recipes (
          id, user_id, title, description, instructions,
          cooking_time, servings, is_public,
          created_at, updated_at, cached_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          user_id = excluded.user_id,
          title = excluded.title,
          description = excluded.description,
          instructions = excluded.instructions,
          cooking_time = excluded.cooking_time,
          servings = excluded.servings,
          is_public = excluded.is_public,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at,
          cached_at = CURRENT_TIMESTAMP`,
        recipe.id,
        recipe.user_id,
        recipe.title,
        recipe.description,
        recipe.instructions,
        recipe.cooking_time,
        recipe.servings,
        recipe.is_public,
        recipe.created_at,
        recipe.updated_at
      );
    }
  });
}

/**
 * Retrieves cached public recipes, ordered from newest to oldest.
 */
export async function getCachedRecipes(): Promise<CachedRecipe[]> {
  const db = await getDatabase();

  return db.getAllAsync<CachedRecipe>(
    `SELECT id, user_id, title, description, instructions,
            cooking_time, servings, is_public, created_at, updated_at
     FROM recipes
     WHERE is_public = 1
     ORDER BY created_at DESC`
  );
}

/**
 * Returns the names of application tables for debugging.
 */
export async function inspectDatabase(): Promise<string[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<{ name: string }>(
    `SELECT name
     FROM sqlite_master
     WHERE type = 'table'
       AND name NOT LIKE 'sqlite_%'
     ORDER BY name`
  );

  return rows.map((row) => row.name);
}

/**
 * Retrieves all ingredients belonging to a recipe.
 */
export async function getIngredients(
  recipeId: number
): Promise<CachedIngredient[]> {
  const db = await getDatabase();

  return db.getAllAsync<CachedIngredient>(
    `SELECT id, recipe_id, name, quantity, unit
     FROM ingredients
     WHERE recipe_id = ?
     ORDER BY id`,
    recipeId
  );
}

/**
 * Inserts an ingredient or updates it if its ID already exists.
 */
export async function saveIngredient(
  ingredient: CachedIngredient
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO ingredients (id, recipe_id, name, quantity, unit)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       recipe_id = excluded.recipe_id,
       name = excluded.name,
       quantity = excluded.quantity,
       unit = excluded.unit`,
    ingredient.id,
    ingredient.recipe_id,
    ingredient.name,
    ingredient.quantity,
    ingredient.unit
  );
}

/**
 * Deletes an ingredient using its ID.
 */
export async function deleteIngredient(
  ingredientId: number
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    "DELETE FROM ingredients WHERE id = ?",
    ingredientId
  );
}

/**
 * Retrieves all categories, sorted alphabetically.
 */
export async function getCategories(): Promise<CachedCategory[]> {
  const db = await getDatabase();

  return db.getAllAsync<CachedCategory>(
    "SELECT id, name FROM categories ORDER BY name"
  );
}

/**
 * Retrieves the categories linked to a specific recipe.
 */
export async function getRecipeCategories(
  recipeId: number
): Promise<CachedCategory[]> {
  const db = await getDatabase();

  return db.getAllAsync<CachedCategory>(
    `SELECT c.id, c.name
     FROM categories c
     INNER JOIN recipe_categories rc ON rc.category_id = c.id
     WHERE rc.recipe_id = ?
     ORDER BY c.name`,
    recipeId
  );
}

/**
 * Inserts a category or updates its name if its ID already exists.
 */
export async function saveCategory(
  category: CachedCategory
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO categories (id, name)
     VALUES (?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name`,
    category.id,
    category.name
  );
}

/**
 * Links a category to a recipe without creating duplicate links.
 */
export async function linkCategoryToRecipe(
  recipeId: number,
  categoryId: number
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT OR IGNORE INTO recipe_categories (recipe_id, category_id)
     VALUES (?, ?)`,
    recipeId,
    categoryId
  );
}

/**
 * Removes the link between a recipe and a category.
 */
export async function unlinkCategoryFromRecipe(
  recipeId: number,
  categoryId: number
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `DELETE FROM recipe_categories
     WHERE recipe_id = ? AND category_id = ?`,
    recipeId,
    categoryId
  );
}

/**
 * Adds a recipe to a user's favourites.
 * INSERT OR IGNORE prevents duplicate entries.
 */
export async function addFavourite(
  userId: number,
  recipeId: number
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT OR IGNORE INTO favourites (user_id, recipe_id)
     VALUES (?, ?)`,
    userId,
    recipeId
  );
}

/**
 * Removes a recipe from a user's favourites.
 */
export async function removeFavourite(
  userId: number,
  recipeId: number
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `DELETE FROM favourites
     WHERE user_id = ? AND recipe_id = ?`,
    userId,
    recipeId
  );
}

/**
 * Returns the IDs of recipes marked as favourites by a user.
 */
export async function getFavouriteRecipeIds(
  userId: number
): Promise<number[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<{ recipe_id: number }>(
    `SELECT recipe_id FROM favourites
     WHERE user_id = ?`,
    userId
  );

  return rows.map((row) => row.recipe_id);
}

/**
 * Defines the fields stored for a shopping-list item.
 */
export type ShoppingListItem = {
  id: number;
  shopping_list_id: number;
  name: string;
  quantity: number | null;
  unit: string | null;
  is_purchased: number;
  created_at: string;
};

/**
 * Retrieves a user's shopping-list ID or creates one if needed.
 */
export async function getOrCreateShoppingList(
  userId: number
): Promise<number> {
  const db = await getDatabase();

  // Creates a list only if the user does not already have one.
  await db.runAsync(
    `INSERT OR IGNORE INTO shopping_lists (user_id)
     VALUES (?)`,
    userId
  );

  // Retrieves the ID of the user's shopping list.
  const row = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM shopping_lists WHERE user_id = ?",
    userId
  );

  if (!row) {
    throw new Error("Could not retrieve shopping list.");
  }

  return row.id;
}

/**
 * Retrieves all items belonging to a shopping list.
 */
export async function getShoppingListItems(
  shoppingListId: number
): Promise<ShoppingListItem[]> {
  const db = await getDatabase();

  return db.getAllAsync<ShoppingListItem>(
    `SELECT id, shopping_list_id, name, quantity, unit,
            is_purchased, created_at
     FROM shopping_list_items
     WHERE shopping_list_id = ?
     ORDER BY id`,
    shoppingListId
  );
}

/**
 * Adds an item to a shopping list and returns its generated ID.
 */
export async function addShoppingListItem(
  shoppingListId: number,
  name: string,
  quantity: number | null = null,
  unit: string | null = null
): Promise<number> {
  const db = await getDatabase();

  const result = await db.runAsync(
    `INSERT INTO shopping_list_items
       (shopping_list_id, name, quantity, unit)
     VALUES (?, ?, ?, ?)`,
    shoppingListId,
    name,
    quantity,
    unit
  );

  return result.lastInsertRowId;
}

/**
 * Updates whether a shopping-list item has been purchased.
 */
export async function setShoppingItemPurchased(
  itemId: number,
  purchased: boolean
): Promise<void> {
  const db = await getDatabase();

  // SQLite stores boolean values as integers: 1 for true and 0 for false.
  await db.runAsync(
    `UPDATE shopping_list_items
     SET is_purchased = ?
     WHERE id = ?`,
    purchased ? 1 : 0,
    itemId
  );
}

/**
 * Deletes a shopping-list item using its ID.
 */
export async function deleteShoppingListItem(
  itemId: number
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    "DELETE FROM shopping_list_items WHERE id = ?",
    itemId
  );
}
