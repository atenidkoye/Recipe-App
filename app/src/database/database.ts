import * as SQLite from "expo-sqlite";


export type CachedIngredient = {
  id: number;
  recipe_id: number;
  name: string;
  quantity: number | null;
  unit: string | null;
};

export type CachedCategory = {
  id: number;
  name: string;
};

export type RecipeWithDetails = CachedRecipe & {
  ingredients: CachedIngredient[];
  categories: CachedCategory[];
};


let database: SQLite.SQLiteDatabase | null = null;

/**
 * Opens the local database and creates the required tables.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return database;
  }

  const db = await SQLite.openDatabaseAsync("recipe_mobile.db");

  

  try {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

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

      CREATE TABLE IF NOT EXISTS ingredients (
        id INTEGER PRIMARY KEY,
        recipe_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity REAL,
        unit TEXT,
        FOREIGN KEY (recipe_id)
          REFERENCES recipes(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS recipe_categories (
        recipe_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        PRIMARY KEY (recipe_id, category_id),
        FOREIGN KEY (recipe_id)
          REFERENCES recipes(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id)
          REFERENCES categories(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS favourites (
        user_id INTEGER NOT NULL,
        recipe_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, recipe_id),
        FOREIGN KEY (recipe_id)
          REFERENCES recipes(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS shopping_lists (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

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

    database = db;
    return db;
  } catch (error) {
    await db.closeAsync();
    throw error;
  }
}

/**
 * Basic recipe shape stored in SQLite.
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
 * Inserts or updates recipe records.
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
 * Returns cached public recipes.
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
 * Lists application tables for debugging.
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

export async function deleteIngredient(
  ingredientId: number
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    "DELETE FROM ingredients WHERE id = ?",
    ingredientId
  );
}


export async function getCategories(): Promise<CachedCategory[]> {
  const db = await getDatabase();

  return db.getAllAsync<CachedCategory>(
    "SELECT id, name FROM categories ORDER BY name"
  );
}

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


export type ShoppingListItem = {
  id: number;
  shopping_list_id: number;
  name: string;
  quantity: number | null;
  unit: string | null;
  is_purchased: number;
  created_at: string;
};

export async function getOrCreateShoppingList(
  userId: number
): Promise<number> {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT OR IGNORE INTO shopping_lists (user_id)
     VALUES (?)`,
    userId
  );

  const row = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM shopping_lists WHERE user_id = ?",
    userId
  );

  if (!row) {
    throw new Error("Could not retrieve shopping list.");
  }

  return row.id;
}

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

export async function setShoppingItemPurchased(
  itemId: number,
  purchased: boolean
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `UPDATE shopping_list_items
     SET is_purchased = ?
     WHERE id = ?`,
    purchased ? 1 : 0,
    itemId
  );
}

export async function deleteShoppingListItem(
  itemId: number
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    "DELETE FROM shopping_list_items WHERE id = ?",
    itemId
  );
}
