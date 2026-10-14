import db from "../../config/database.js";
import type { User } from "./auth.types.js";

export const authRepository = {
  // Find a user by email, including the password hash for login verification.
  findByEmail(email: string) {
    const statement = db.prepare(`
      SELECT id, name, email, password_hash, created_at
      FROM users
      WHERE email = ?
    `);

    // The ? placeholder binds the email value safely instead of inserting it into the SQL string.
    // password_hash is included for authentication but must not be returned to the client.
    return statement.get(email) as
      | (User & { password_hash: string })
      | undefined;
  },

  // Find a user by their database ID and return only public account fields.
  findById(id: number): User | undefined {
    const statement = db.prepare(`
      SELECT id, name, email, created_at
      FROM users
      WHERE id = ?
    `);

    // The password hash is intentionally excluded from this query's result.
    return statement.get(id) as User | undefined;
  },

  // Insert a new user record and return the newly created user's public details.
  create(
    name: string,
    email: string,
    passwordHash: string
  ): User {
    const statement = db.prepare(`
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `);

    // Execute the INSERT using parameterized values to safely pass user data.
    const result = statement.run(name, email, passwordHash);

    // SQLite provides the ID of the newly inserted row; use it to retrieve the user.
    const user = this.findById(Number(result.lastInsertRowid));

    // Stop if the inserted record cannot be retrieved as expected.
    if (!user) {
      throw new Error("Failed to retrieve created user");
    }

    return user;
  }
};