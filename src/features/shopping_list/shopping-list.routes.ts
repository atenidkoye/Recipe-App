import { Router } from "express";
import { shoppingListController } from "./shopping-list.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

// Requires authentication for all shopping list routes.
router.use(authMiddleware);

// Retrieves all items in the user's shopping list.
router.get("/", shoppingListController.getItems);

// Adds a new item to the user's shopping list.
router.post("/", shoppingListController.addItem);

// Updates an existing shopping list item.
router.put("/:id", shoppingListController.updateItem);

// Deletes an item from the user's shopping list.
router.delete("/:id", shoppingListController.deleteItem);

export default router;