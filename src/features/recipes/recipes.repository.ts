
import db from "../../config/database.js";
import type {
  Recipe,
  CreateRecipeInput,
  UpdateRecipeInput
} from "./recipes.types.js";

// Repository layer: handles direct communication with the recipes database table.
export const recipesRepository = {
  // Creates a new recipe belonging to the specified user.
  create(userId: number, input: CreateRecipeInput): Recipe {
    // Prepare an SQL INSERT statement to add the recipe to the database.
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

    // Execute the INSERT using parameterized values to safely pass user input.
    // Optional fields receive null or a default value when they are not provided.
    const result = statement.run(
      userId,
      input.title,
      input.description ?? null,
      input.instructions,
      input.cooking_time ?? null,
      input.servings ?? null,
      input.is_public ?? 1
    );

    // Retrieve and return the newly created recipe using its generated database ID.
    // The ! asserts that a recipe will be found; it does not perform a runtime check.
    return this.findById(Number(result.lastInsertRowid))!;
  },

  // Retrieves all public recipes, with the newest recipes shown first.
  findAll(): Recipe[] {
    return db.prepare(`
      SELECT * FROM recipes
      WHERE is_public = 1
      ORDER BY created_at DESC
    `).all() as Recipe[];
  },

  // Retrieves one recipe by its ID, regardless of whether it is public or private.
  // Returns undefined if no recipe with the given ID exists.
  findById(id: number): Recipe | undefined {
    return db.prepare(`
      SELECT * FROM recipes
      WHERE id = ?
    `).get(id) as Recipe | undefined;
  },

  // Retrieves all recipes created by a specific user, newest first.
  findByUserId(userId: number): Recipe[] {
    return db.prepare(`
      SELECT * FROM recipes
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(userId) as Recipe[];
  },

  // Updates a recipe only when both its ID and owner's user ID match.
  // Returns true if at least one database row was changed, otherwise false.
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

    // Pass the new values to the query.
    // COALESCE keeps the existing database value when an input is null.
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

    // Check whether the database reports any changed rows.
    return result.changes > 0;
  },

  // Deletes a recipe only if it belongs to the specified user.
  // Returns false if no matching recipe was deleted.
  delete(id: number, userId: number): boolean {
    const result = db.prepare(`
      DELETE FROM recipes
      WHERE id = ? AND user_id = ?
    `).run(id, userId);

    return result.changes > 0;
  }
};
