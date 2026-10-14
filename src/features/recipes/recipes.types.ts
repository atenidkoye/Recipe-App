
// Represents a recipe as stored in the database.
export interface Recipe {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  instructions: string;
  cooking_time: number | null;
  servings: number | null;
  is_public: number;
  created_at: string;
  updated_at: string;
}

// Defines the data required when creating a new recipe.
// Fields marked with ? are optional.
export interface CreateRecipeInput {
  title: string;
  description?: string;
  instructions: string;
  cooking_time?: number;
  servings?: number;
  is_public?: number;
}

// Defines the fields that can be updated on an existing recipe.
// All fields are optional to allow partial updates.
export interface UpdateRecipeInput {
  title?: string;
  description?: string;
  instructions?: string;
  cooking_time?: number;
  servings?: number;
  is_public?: number;
}
