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

export interface CreateRecipeInput {
  title: string;
  description?: string;
  instructions: string;
  cooking_time?: number;
  servings?: number;
  is_public?: number;
}

export interface UpdateRecipeInput {
  title?: string;
  description?: string;
  instructions?: string;
  cooking_time?: number;
  servings?: number;
  is_public?: number;
}