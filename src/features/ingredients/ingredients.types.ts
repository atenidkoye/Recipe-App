export interface Ingredient {
  id: number;
  recipe_id: number;
  name: string;
  quantity: number | null;
  unit: string | null;
}

export interface CreateIngredientInput {
  name: string;
  quantity?: number;
  unit?: string;
}