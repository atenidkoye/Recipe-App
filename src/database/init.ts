import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db from "../config/database.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const schemaPath = path.join(currentDirectory, "schema.sql");

const schema = fs.readFileSync(schemaPath, "utf-8");

db.exec(schema);

console.log("Database tables created successfully!");