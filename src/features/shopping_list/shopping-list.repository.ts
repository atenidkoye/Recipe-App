
import db from "../../config/database.js";
import type {
  ShoppingList,
  ShoppingListItem,
  CreateShoppingListItemInput,
  UpdateShoppingListItemInput,
} from "./shopping-list.types.js";

export const shoppingListRepository = {
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

  getItems(shoppingListId: number): ShoppingListItem[] {
    return db.prepare(`
      SELECT *
      FROM shopping_list_items
      WHERE shopping_list_id = ?
      ORDER BY created_at DESC, id DESC
    `).all(shoppingListId) as ShoppingListItem[];
  },

  getItemById(itemId: number): ShoppingListItem | undefined {
    return db.prepare(`
      SELECT *
      FROM shopping_list_items
      WHERE id = ?
    `).get(itemId) as ShoppingListItem | undefined;
  },

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

    return this.getItemById(Number(result.lastInsertRowid))!;
  },

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

  deleteItem(itemId: number): boolean {
    const result = db.prepare(`
      DELETE FROM shopping_list_items
      WHERE id = ?
    `).run(itemId);

    return result.changes > 0;
  },
};
