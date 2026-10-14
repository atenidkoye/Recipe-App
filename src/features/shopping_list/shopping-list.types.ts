
// Represents a user's shopping list.
export interface ShoppingList {
  id: number;
  user_id: number;
  created_at: string;
}

// Represents an individual item in a shopping list.
export interface ShoppingListItem {
  id: number;
  shopping_list_id: number;
  name: string;
  quantity: number | null;
  unit: string | null;
  is_purchased: number;
  created_at: string;
}

// Defines the data required to add an item to a shopping list.
// Quantity and unit are optional and can be null.
export interface CreateShoppingListItemInput {
  name: string;
  quantity?: number | null;
  unit?: string | null;
}

// Defines the fields that can be updated on an existing shopping list item.
export interface UpdateShoppingListItemInput {
  name?: string;
  quantity?: number | null;
  unit?: string | null;
  is_purchased?: number;
}
