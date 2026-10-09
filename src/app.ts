import express from "express";

import authRoutes from "./features/auth/auth.routes.js";
import recipeRoutes from "./features/recipes/recipes.routes.js";
import ingredientRoutes from "./features/ingredients/ingredients.routes.js";
import categoryRoutes from "./features/categories/categories.routes.js";
import favouriteRoutes from "./features/favorites/favorites.routes.js";

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
app.use("/api/categories", categoryRoutes);
app.use("/api/favourites", favouriteRoutes);

export default app;