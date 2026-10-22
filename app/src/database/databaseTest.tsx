import { useEffect } from "react";
import { inspectDatabase, getDatabase } from "./database";

export default function DatabaseTest() {
  useEffect(() => {
    const testDatabase = async () => {
      try {
        const db = await getDatabase();

        console.log("SQLite initialized successfully");

        const tables = await inspectDatabase();
        console.log("SQLite tables:", tables);

        const columns = await db.getAllAsync<{ name: string }>(
          "PRAGMA table_info(recipes)"
        );

        console.log(
          "Recipe columns:",
          columns.map((column) => column.name)
        );
      } catch (error) {
        console.error("SQLite initialization failed:", error);
      }
    };

    testDatabase();
  }, []);

  return null;
}