
import { shoppingListRepository } from "./shopping-list.repository.js";
import type {
  CreateShoppingListItemInput,
  UpdateShoppingListItemInput,
} from "./shopping-list.types.js";

export const shoppingListService = {
  getItems(userId: number) {
    const list = shoppingListRepository.getOrCreateList(userId);
    return shoppingListRepository.getItems(list.id);
  },

  addItem(userId: number, input: CreateShoppingListItemInput) {
    const name = input.name?.trim();

    if (!name) {
      throw new Error("Item name is required");
    }

    if (
      input.quantity !== undefined &&
      input.quantity !== null &&
      (!Number.isFinite(input.quantity) || input.quantity < 0)
    ) {
      throw new Error("Quantity must be a non-negative number");
    }

    const list = shoppingListRepository.getOrCreateList(userId);

    return shoppingListRepository.addItem(list.id, {
      ...input,
      name,
    });
  },

  updateItem(
    userId: number,
    itemId: number,
    input: UpdateShoppingListItemInput
  ) {
    const list = shoppingListRepository.getOrCreateList(userId);
    const item = shoppingListRepository.getItemById(itemId);

    if (!item || item.shopping_list_id !== list.id) {
      return undefined;
    }

    if (input.name !== undefined && !input.name.trim()) {
      throw new Error("Item name cannot be empty");
    }

    if (
      input.quantity !== undefined &&
      input.quantity !== null &&
      (!Number.isFinite(input.quantity) || input.quantity < 0)
    ) {
      throw new Error("Quantity must be a non-negative number");
    }

    if (
      input.is_purchased !== undefined &&
      ![0, 1].includes(input.is_purchased)
    ) {
      throw new Error("is_purchased must be 0 or 1");
    }

    return shoppingListRepository.updateItem(itemId, {
      ...input,
      ...(input.name !== undefined
        ? { name: input.name.trim() }
        : {}),
    });
  },

  deleteItem(userId: number, itemId: number) {
    const list = shoppingListRepository.getOrCreateList(userId);
    const item = shoppingListRepository.getItemById(itemId);

    if (!item || item.shopping_list_id !== list.id) {
      return false;
    }

    return shoppingListRepository.deleteItem(itemId);
  },
};
