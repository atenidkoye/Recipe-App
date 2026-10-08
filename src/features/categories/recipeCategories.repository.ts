import db from "../../config/database.js";

export const recipeCategoriesRepository = {
  add(recipeId: number, categoryId: number) {
    const statement = db.prepare(`
      INSERT INTO recipe_categories (
        recipe_id,
        category_id
      )
      VALUES (?, ?)
    `);

    statement.run(recipeId, categoryId);
  },

  getCategoriesForRecipe(recipeId: number) {
    return db.prepare(`
      SELECT c.*
      FROM categories c
      JOIN recipe_categories rc
        ON c.id = rc.category_id
      WHERE rc.recipe_id = ?
      ORDER BY c.name
    `).all(recipeId);
  },

  getRecipesForCategory(categoryId: number) {
    return db.prepare(`
      SELECT r.*
      FROM recipes r
      JOIN recipe_categories rc
        ON r.id = rc.recipe_id
      WHERE rc.category_id = ?
      AND r.is_public = 1
      ORDER BY r.created_at DESC
    `).all(categoryId);
  },

  remove(recipeId: number, categoryId: number) {
    const result = db.prepare(`
      DELETE FROM recipe_categories
      WHERE recipe_id = ?
      AND category_id = ?
    `).run(recipeId, categoryId);

    return result.changes > 0;
  }
};