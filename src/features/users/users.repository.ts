import db from "../../config/database.js";
import type { User, UpdateUserInput } from "./users.types.js";

// Handles database operations for user accounts.
export const usersRepository = {
  // Retrieves a user's public account details by ID.
  findById(id: number): User | undefined {
    return db.prepare(`
      SELECT id, name, email, created_at
      FROM users
      WHERE id = ?
    `).get(id) as User | undefined;
  },

  // Finds another account using the email address, excluding the current user.
    findByEmail(email: string, excludeUserId: number): User | undefined {
    return db.prepare(`
        SELECT id, name, email, created_at
        FROM users
        WHERE email = ? AND id != ?
    `).get(email, excludeUserId) as User | undefined;
    },

  // Updates a user's name or email and returns the updated account.
  update(id: number, input: UpdateUserInput): User | undefined {
    const existing = this.findById(id);

    if (!existing) {
      return undefined;
    }

    // Keep existing values for fields that were not provided.
    const updated = {
      name: input.name ?? existing.name,
      email: input.email ?? existing.email,
    };

    db.prepare(`
      UPDATE users
      SET name = ?, email = ?
      WHERE id = ?
    `).run(
      updated.name,
      updated.email,
      id
    );

    return this.findById(id);
  }
};
