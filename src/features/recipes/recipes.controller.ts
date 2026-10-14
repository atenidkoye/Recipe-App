import { Request, Response } from "express";
import { recipesService } from "./recipes.service.js";
import { AuthRequest } from "../../middleware/authMiddleware.js";

// Create a new recipe for the currently authenticated user.
export const createRecipe = (req: AuthRequest, res: Response) => {
  try {
    // Pass the authenticated user's ID and submitted recipe data to the service.
    const recipe = recipesService.create(
      req.userId!,
      req.body
    );

    // Return HTTP 201 to indicate that the recipe was created successfully.
    res.status(201).json(recipe);
  } catch (error) {
    // Return a client error when the recipe cannot be created.
    res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Could not create recipe"
    });
  }
};

// Retrieve all recipes available through the service.
export const getRecipes = (_req: Request, res: Response) => {
  try {
    // The underscore indicates that the request object is intentionally unused.
    const recipes = recipesService.getAll();

    // Return the recipe collection with HTTP 200.
    res.status(200).json(recipes);
  } catch {
    // Return a server error if retrieving the recipes fails unexpectedly.
    res.status(500).json({
      message: "Could not get recipes"
    });
  }
};

// Retrieve a single recipe using the ID provided in the URL.
export const getRecipe = (req: Request, res: Response) => {
  try {
    // Convert the route parameter from a string to a number before calling the service.
    const recipe = recipesService.getById(
      Number(req.params.id)
    );

    // Return the requested recipe.
    res.status(200).json(recipe);
  } catch (error) {
    // Return HTTP 404 when the service reports that the recipe cannot be found.
    res.status(404).json({
      message: error instanceof Error
        ? error.message
        : "Recipe not found"
    });
  }
};

// Retrieve recipes owned by the currently authenticated user.
export const getMyRecipes = (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Use the user ID attached by the authentication middleware.
    const recipes = recipesService.getMyRecipes(
      req.userId!
    );

    // Return only the recipes selected by the service for this user.
    res.status(200).json(recipes);
  } catch {
    // Return a server error if the user's recipes cannot be retrieved.
    res.status(500).json({
      message: "Could not get your recipes"
    });
  }
};

// Update an existing recipe belonging to the authenticated user.
export const updateRecipe = (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Pass the recipe ID, authenticated user's ID, and updated data to the service.
    // The service should verify ownership before allowing the update.
    const recipe = recipesService.update(
      Number(req.params.id),
      req.userId!,
      req.body
    );

    // Return the updated recipe.
    res.status(200).json(recipe);
  } catch (error) {
    // Return an error if the update fails.
    res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Could not update recipe"
    });
  }
};

// Delete a recipe belonging to the authenticated user.
export const deleteRecipe = (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Pass both IDs so the service can check that the user owns the recipe.
    recipesService.delete(
      Number(req.params.id),
      req.userId!
    );

    // Confirm that the deletion completed successfully.
    res.status(200).json({
      message: "Recipe deleted successfully"
    });
  } catch (error) {
    // Return an error if the recipe could not be deleted.
    res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Could not delete recipe"
    });
  }
};