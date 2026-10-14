
import { Request, Response } from "express";
import { categoriesService } from "./categories.service.js";

// Retrieves all available recipe categories.
export const getCategories = (
  _req: Request,
  res: Response
) => {
  try {
    const categories = categoriesService.getAll();

    res.status(200).json(categories);
  } catch {
    res.status(500).json({
      message: "Could not get categories"
    });
  }
};

// Retrieves a single category using its ID.
export const getCategory = (
  req: Request,
  res: Response
) => {
  try {
    const category = categoriesService.getById(
      Number(req.params.id)
    );

    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({
      message: error instanceof Error
        ? error.message
        : "Category not found"
    });
  }
};

// Creates a new category using the name provided in the request body.
export const createCategory = (
  req: Request,
  res: Response
) => {
  try {
    const category = categoriesService.create(
      req.body.name
    );

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Could not create category"
    });
  }
};
