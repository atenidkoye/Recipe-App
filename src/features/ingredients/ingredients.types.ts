
// Represents an ingredient stored in the database.
export interface Ingredient {
  id: number;
  recipe_id: number;
  name: string;
  quantity: number | null;
  unit: string | null;
}

// Defines the data required to create a new ingredient.
// Quantity and unit are optional.
export interface CreateIngredientInput {
  name: string;
  quantity?: number;
  unit?: string;
}
