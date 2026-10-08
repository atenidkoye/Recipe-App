import db from "../../config/database.js";
import type {
  Category,
  CreateCategoryInput
} from "./categories.types.js";

export const categoriesRepository = {
  findAll(): Category[] {
    return db.prepare(`
      SELECT *
      FROM categories
      ORDER BY name
    `).all() as Category[];
  },

  findById(id: number): Category | undefined {
    return db.prepare(`
      SELECT *
      FROM categories
      WHERE id = ?
    `).get(id) as Category | undefined;
  },

  create(input: CreateCategoryInput): Category {
    const statement = db.prepare(`
      INSERT INTO categories (name)
      VALUES (?)
    `);

    const result = statement.run(input.name);

    return this.findById(
      Number(result.lastInsertRowid)
    )!;
  }
};