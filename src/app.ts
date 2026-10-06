import express from "express";

import authRoutes from "./features/auth/auth.routes.js";
import recipeRoutes from "./features/recipes/recipes.routes.js";
import ingredientRoutes from "./features/ingredients/ingredients.routes.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Recipe App API is running!"
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/recipes", recipeRoutes);

app.use("/api/ingredients", ingredientRoutes);

export default app;