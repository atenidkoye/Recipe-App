
import db from "../../config/database.js";
import type {
  Category,
  CreateCategoryInput
} from "./categories.types.js";

// Handles database queries for recipe categories.
export const categoriesRepository = {
  // Retrieves all categories in alphabetical order.
  findAll(): Category[] {
    return db.prepare(`
      SELECT *
      FROM categories
      ORDER BY name
    `).all() as Category[];
  },

  // Retrieves a category by its ID.
  // Returns undefined if the category does not exist.
  findById(id: number): Category | undefined {
    return db.prepare(`
      SELECT *
      FROM categories
      WHERE id = ?
    `).get(id) as Category | undefined;
  },

  // Creates a new category and returns the saved record.
  create(input: CreateCategoryInput): Category {
    const statement = db.prepare(`
      INSERT INTO categories (name)
      VALUES (?)
    `);

    const result = statement.run(input.name);

    // Fetch the newly created category using its generated ID.
    return this.findById(
      Number(result.lastInsertRowid)
    )!;
  }
};
