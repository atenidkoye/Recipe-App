
import type { Request, Response } from "express";
import { shoppingListService } from "./shopping-list.service.js";
import type { AuthRequest } from "../../middleware/authMiddleware.js";

export const shoppingListController = {
  getItems(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).userId!;

      const items = shoppingListService.getItems(userId);

      return res.status(200).json(items);
    } catch (error) {
      console.error("Get shopping list error:", error);
      return res.status(500).json({
        message: "Failed to retrieve shopping list",
      });
    }
  },

  addItem(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).userId!;
      const { name, quantity, unit } = req.body;

      const item = shoppingListService.addItem(userId, {
        name,
        quantity,
        unit,
      });

      return res.status(201).json({
        message: "Shopping list item added successfully",
        item,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Failed to add shopping list item",
      });
    }
  },

  updateItem(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).userId!;
      const itemId = Number(req.params.id);

      if (!Number.isInteger(itemId) || itemId <= 0) {
        return res.status(400).json({
          message: "Invalid shopping list item ID",
        });
      }

      const item = shoppingListService.updateItem(
        userId,
        itemId,
        req.body
      );

      if (!item) {
        return res.status(404).json({
          message: "Shopping list item not found",
        });
      }

      return res.status(200).json({
        message: "Shopping list item updated successfully",
        item,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Failed to update shopping list item",
      });
    }
  },

  deleteItem(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).userId!;
      const itemId = Number(req.params.id);

      if (!Number.isInteger(itemId) || itemId <= 0) {
        return res.status(400).json({
          message: "Invalid shopping list item ID",
        });
      }

      const deleted = shoppingListService.deleteItem(userId, itemId);

      if (!deleted) {
        return res.status(404).json({
          message: "Shopping list item not found",
        });
      }

      return res.status(200).json({
        message: "Shopping list item deleted successfully",
      });
    } catch (error) {
      console.error("Delete shopping list item error:", error);
      return res.status(500).json({
        message: "Failed to delete shopping list item",
      });
    }
  },
};
