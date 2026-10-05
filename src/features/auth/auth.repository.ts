import db from "../../config/database.js";
import type { User } from "./auth.types.js";

export const authRepository = {
  findByEmail(email: string) {
    const statement = db.prepare(`
      SELECT id, name, email, password_hash, created_at
      FROM users
      WHERE email = ?
    `);

    return statement.get(email) as
      | (User & { password_hash: string })
      | undefined;
  },

  findById(id: number): User | undefined {
    const statement = db.prepare(`
      SELECT id, name, email, created_at
      FROM users
      WHERE id = ?
    `);

    return statement.get(id) as User | undefined;
  },

  create(
    name: string,
    email: string,
    passwordHash: string
  ): User {
    const statement = db.prepare(`
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `);

    const result = statement.run(name, email, passwordHash);

    const user = this.findById(Number(result.lastInsertRowid));

    if (!user) {
      throw new Error("Failed to retrieve created user");
    }

    return user;
  }
};