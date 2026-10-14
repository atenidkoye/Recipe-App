import db from "../../config/database.js";
import type {
  Ingredient,
  CreateIngredientInput
} from "./ingredients.types.js";

// Handles database operations for recipe ingredients.
export const ingredientsRepository = {
  // Creates an ingredient and returns the saved record.
  create(
    recipeId: number,
    input: CreateIngredientInput
  ): Ingredient {
    const statement = db.prepare(`
      INSERT INTO ingredients (
        recipe_id,
        name,
        quantity,
        unit
      )
      VALUES (?, ?, ?, ?)
    `);

    const result = statement.run(
      recipeId,
      input.name,
      input.quantity ?? null,
      input.unit ?? null
    );

    // Fetches the newly created ingredient using its generated ID.
    return this.findById(
      Number(result.lastInsertRowid)
    )!;
  },

  // Retrieves an ingredient by its ID.
  // Returns undefined if it does not exist.
  findById(id: number): Ingredient | undefined {
    return db.prepare(`
      SELECT *
      FROM ingredients
      WHERE id = ?
    `).get(id) as Ingredient | undefined;
  },

  // Retrieves all ingredients for a recipe, ordered by ID.
  findByRecipeId(recipeId: number): Ingredient[] {
    return db.prepare(`
      SELECT *
      FROM ingredients
      WHERE recipe_id = ?
      ORDER BY id
    `).all(recipeId) as Ingredient[];
  },

  // Deletes an ingredient by its ID.
  // Returns true if a record was deleted.
  delete(id: number): boolean {
    const result = db.prepare(`
      DELETE FROM ingredients
      WHERE id = ?
    `).run(id);

    return result.changes > 0;
  }
};