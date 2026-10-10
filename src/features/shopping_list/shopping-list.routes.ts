
import { Router } from "express";
import { shoppingListController } from "./shopping-list.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", shoppingListController.getItems);
router.post("/", shoppingListController.addItem);
router.put("/:id", shoppingListController.updateItem);
router.delete("/:id", shoppingListController.deleteItem);

export default router;
