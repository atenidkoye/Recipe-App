import db from "../../config/database.js";
import type {
  ShoppingList,
  ShoppingListItem,
  CreateShoppingListItemInput,
  UpdateShoppingListItemInput,
} from "./shopping-list.types.js";

// Handles database operations for shopping lists and their items.
export const shoppingListRepository = {
  // Retrieves the user's shopping list or creates one if it doesn't exist.
  getOrCreateList(userId: number): ShoppingList {
    db.prepare(`
      INSERT INTO shopping_lists (user_id)
      VALUES (?)
      ON CONFLICT(user_id) DO NOTHING
    `).run(userId);

    return db.prepare(`
      SELECT *
      FROM shopping_lists
      WHERE user_id = ?
    `).get(userId) as ShoppingList;
  },

  // Retrieves all items in a shopping list, newest first.
  getItems(shoppingListId: number): ShoppingListItem[] {
    return db.prepare(`
      SELECT *
      FROM shopping_list_items
      WHERE shopping_list_id = ?
      ORDER BY created_at DESC, id DESC
    `).all(shoppingListId) as ShoppingListItem[];
  },

  // Retrieves a shopping list item by its ID.
  getItemById(itemId: number): ShoppingListItem | undefined {
    return db.prepare(`
      SELECT *
      FROM shopping_list_items
      WHERE id = ?
    `).get(itemId) as ShoppingListItem | undefined;
  },

  // Adds an item to a shopping list and returns the saved record.
  addItem(
    shoppingListId: number,
    input: CreateShoppingListItemInput
  ): ShoppingListItem {
    const result = db.prepare(`
      INSERT INTO shopping_list_items
        (shopping_list_id, name, quantity, unit)
      VALUES (?, ?, ?, ?)
    `).run(
      shoppingListId,
      input.name,
      input.quantity ?? null,
      input.unit ?? null
    );

    // Fetches the newly created item using its generated ID.
    return this.getItemById(Number(result.lastInsertRowid))!;
  },

  // Updates an existing item while keeping fields that were not provided unchanged.
  updateItem(
    itemId: number,
    input: UpdateShoppingListItemInput
  ): ShoppingListItem | undefined {
    const existing = this.getItemById(itemId);

    if (!existing) {
      return undefined;
    }

    const updated = {
      name: input.name ?? existing.name,
      quantity: input.quantity === undefined
        ? existing.quantity
        : input.quantity,
      unit: input.unit === undefined
        ? existing.unit
        : input.unit,
      is_purchased: input.is_purchased ?? existing.is_purchased,
    };

    db.prepare(`
      UPDATE shopping_list_items
      SET name = ?, quantity = ?, unit = ?, is_purchased = ?
      WHERE id = ?
    `).run(
      updated.name,
      updated.quantity,
      updated.unit,
      updated.is_purchased,
      itemId
    );

    return this.getItemById(itemId);
  },

  // Deletes an item by its ID and reports whether a record was removed.
  deleteItem(itemId: number): boolean {
    const result = db.prepare(`
      DELETE FROM shopping_list_items
      WHERE id = ?
    `).run(itemId);

    return result.changes > 0;
  },
};
