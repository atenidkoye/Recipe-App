
import { useEffect } from "react";
import { inspectDatabase, getDatabase } from "./database";

// Component used to verify that the local SQLite database initializes correctly.
export default function DatabaseTest() {
  // Runs the database check when the component mounts.
  useEffect(() => {
    const testDatabase = async () => {
      try {
        // Opens the database and creates any missing tables.
        const db = await getDatabase();

        // Confirms that the database initialization completed successfully.
        console.log("SQLite initialized successfully");

        // Retrieves and prints the names of the application database tables.
        const tables = await inspectDatabase();
        console.log("SQLite tables:", tables);

        // Retrieves the column definitions for the recipes table.
        const columns = await db.getAllAsync<{ name: string }>(
          "PRAGMA table_info(recipes)"
        );

        // Prints the recipe table's column names for verification.
        console.log(
          "Recipe columns:",
          columns.map((column) => column.name)
        );
      } catch (error) {
        // Logs any errors that occur during database initialization or inspection.
        console.error("SQLite initialization failed:", error);
      }
    };

    // Starts the database verification process.
    testDatabase();
  }, []);

  // Renders no visible UI because this component is only for testing.
  return null;
}
