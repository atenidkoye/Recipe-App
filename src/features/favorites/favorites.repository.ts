import db from "../../config/database.js";
import type { Favourite } from "./favorites.types.js";

// Handles database operations for users' favourite recipes.
export const favouritesRepository = {
  // Adds a recipe to a user's favourites.
  add(userId: number, recipeId: number): void {
    const statement = db.prepare(`
      INSERT INTO favourites (user_id, recipe_id)
      VALUES (?, ?)
    `);

    statement.run(userId, recipeId);
  },

  // Removes a recipe from a user's favourites.
  // Returns true if a matching record was deleted.
  remove(userId: number, recipeId: number): boolean {
    const result = db.prepare(`
      DELETE FROM favourites
      WHERE user_id = ?
      AND recipe_id = ?
    `).run(userId, recipeId);

    return result.changes > 0;
  },

  // Retrieves all favourite records belonging to a specific user.
  findByUserId(userId: number): Favourite[] {
    return db.prepare(`
      SELECT user_id, recipe_id
      FROM favourites
      WHERE user_id = ?
    `).all(userId) as Favourite[];
  },

  // Checks whether a specific recipe is already in a user's favourites.
  // Returns undefined if no matching record exists.
  findOne(
    userId: number,
    recipeId: number
  ): Favourite | undefined {
    return db.prepare(`
      SELECT user_id, recipe_id
      FROM favourites
      WHERE user_id = ?
      AND recipe_id = ?
    `).get(userId, recipeId) as Favourite | undefined;
  }
};
