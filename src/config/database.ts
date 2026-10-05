import Database from "better-sqlite3";
import path from "node:path";

const databasePath = path.resolve(
  process.env.DATABASE_PATH ?? "./src/database/recipe_app.db"
);

const db = new Database(databasePath);

db.pragma("foreign_keys = ON");

export default db;