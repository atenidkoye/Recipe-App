import db from "../../config/database.js";
import type {
  Recipe,
  CreateRecipeInput,
  UpdateRecipeInput
} from "./recipes.types.js";

export const recipesRepository = {
  create(userId: number, input: CreateRecipeInput): Recipe {
    const statement = db.prepare(`
      INSERT INTO recipes (
        user_id,
        title,
        description,
        instructions,
        cooking_time,
        servings,
        is_public
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = statement.run(
      userId,
      input.title,
      input.description ?? null,
      input.instructions,
      input.cooking_time ?? null,
      input.servings ?? null,
      input.is_public ?? 1
    );

    return this.findById(Number(result.lastInsertRowid))!;
  },

  findAll(): Recipe[] {
    return db.prepare(`
      SELECT * FROM recipes
      WHERE is_public = 1
      ORDER BY created_at DESC
    `).all() as Recipe[];
  },

  findById(id: number): Recipe | undefined {
    return db.prepare(`
      SELECT * FROM recipes
      WHERE id = ?
    `).get(id) as Recipe | undefined;
  },

  findByUserId(userId: number): Recipe[] {
    return db.prepare(`
      SELECT * FROM recipes
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(userId) as Recipe[];
  },

  update(
    id: number,
    userId: number,
    input: UpdateRecipeInput
  ): boolean {
    const statement = db.prepare(`
      UPDATE recipes
      SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        instructions = COALESCE(?, instructions),
        cooking_time = COALESCE(?, cooking_time),
        servings = COALESCE(?, servings),
        is_public = COALESCE(?, is_public),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);

    const result = statement.run(
      input.title ?? null,
      input.description ?? null,
      input.instructions ?? null,
      input.cooking_time ?? null,
      input.servings ?? null,
      input.is_public ?? null,
      id,
      userId
    );

    return result.changes > 0;
  },

  delete(id: number, userId: number): boolean {
    const result = db.prepare(`
      DELETE FROM recipes
      WHERE id = ? AND user_id = ?
    `).run(id, userId);

    return result.changes > 0;
  }
};