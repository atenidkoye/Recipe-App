
export interface ShoppingList {
  id: number;
  user_id: number;
  created_at: string;
}

export interface ShoppingListItem {
  id: number;
  shopping_list_id: number;
  name: string;
  quantity: number | null;
  unit: string | null;
  is_purchased: number;
  created_at: string;
}

export interface CreateShoppingListItemInput {
  name: string;
  quantity?: number | null;
  unit?: string | null;
}

export interface UpdateShoppingListItemInput {
  name?: string;
  quantity?: number | null;
  unit?: string | null;
  is_purchased?: number;
}
