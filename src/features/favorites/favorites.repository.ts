import db from "../../config/database.js";
import type { Favourite } from "./favorites.types.js";

export const favouritesRepository = {
  add(userId: number, recipeId: number): void {
    const statement = db.prepare(`
      INSERT INTO favourites (user_id, recipe_id)
      VALUES (?, ?)
    `);

    statement.run(userId, recipeId);
  },

  remove(userId: number, recipeId: number): boolean {
    const result = db.prepare(`
      DELETE FROM favourites
      WHERE user_id = ?
      AND recipe_id = ?
    `).run(userId, recipeId);

    return result.changes > 0;
  },

  findByUserId(userId: number): Favourite[] {
    return db.prepare(`
      SELECT user_id, recipe_id
      FROM favourites
      WHERE user_id = ?
    `).all(userId) as Favourite[];
  },

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