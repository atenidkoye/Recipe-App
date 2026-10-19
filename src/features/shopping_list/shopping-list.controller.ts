
import type { Response } from "express";
import { shoppingListService } from "./shopping-list.service.js";
import type { AuthRequest } from "../../middleware/authMiddleware.js";
import { HTTP_STATUS } from "../../utils/http-status.js";
import { AppError } from "../../utils/app-error.js";

// Handles HTTP requests for the user's shopping list.
export const shoppingListController = {
  // Retrieves all shopping list items belonging to the authenticated user.
  getItems(req: AuthRequest, res: Response) {
    const items = shoppingListService.getItems(req.userId!);

    return res.status(HTTP_STATUS.OK).json({
      message: "Shopping list retrieved successfully",
      data: items,
    });
  },

  // Adds a new item to the authenticated user's shopping list.
  addItem(req: AuthRequest, res: Response) {
    const { name, quantity, unit } = req.body;

    const item = shoppingListService.addItem(req.userId!, {
      name,
      quantity,
      unit,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      message: "Shopping list item added successfully",
      data: item,
    });
  },

  // Updates a shopping list item after validating its ID.
  updateItem(req: AuthRequest, res: Response) {
    const itemId = Number(req.params.id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid shopping list item ID"
      );
    }

    const item = shoppingListService.updateItem(
      req.userId!,
      itemId,
      req.body
    );

    if (!item) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        "Shopping list item not found"
      );
    }

    return res.status(HTTP_STATUS.OK).json({
      message: "Shopping list item updated successfully",
      data: item,
    });
  },

  // Deletes a shopping list item after validating its ID.
  deleteItem(req: AuthRequest, res: Response) {
    const itemId = Number(req.params.id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid shopping list item ID"
      );
    }

    const deleted = shoppingListService.deleteItem(
      req.userId!,
      itemId
    );

    if (!deleted) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        "Shopping list item not found"
      );
    }

    return res.status(HTTP_STATUS.OK).json({
      message: "Shopping list item deleted successfully",
    });
  },
};
