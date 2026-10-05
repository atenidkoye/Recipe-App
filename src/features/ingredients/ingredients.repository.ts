import db from "../../config/database.js";
import type {
  Ingredient,
  CreateIngredientInput
} from "./ingredients.types.js";

export const ingredientsRepository = {
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

    return this.findById(
      Number(result.lastInsertRowid)
    )!;
  },

  findById(id: number): Ingredient | undefined {
    return db.prepare(`
      SELECT *
      FROM ingredients
      WHERE id = ?
    `).get(id) as Ingredient | undefined;
  },

  findByRecipeId(recipeId: number): Ingredient[] {
    return db.prepare(`
      SELECT *
      FROM ingredients
      WHERE recipe_id = ?
      ORDER BY id
    `).all(recipeId) as Ingredient[];
  },

  delete(id: number): boolean {
    const result = db.prepare(`
      DELETE FROM ingredients
      WHERE id = ?
    `).run(id);

    return result.changes > 0;
  }
};