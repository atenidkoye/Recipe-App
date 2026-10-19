
import type { Request, Response } from "express";
import { categoriesService } from "./categories.service.js";
import { HTTP_STATUS } from "../../utils/http-status.js";
import { AppError } from "../../utils/app-error.js";

// Retrieves all available recipe categories.
export const getCategories = (
  _req: Request,
  res: Response
) => {
  const categories = categoriesService.getAll();

  return res.status(HTTP_STATUS.OK).json({
    message: "Categories retrieved successfully",
    data: categories,
  });
};

// Retrieves a single category using its ID.
export const getCategory = (
  req: Request,
  res: Response
) => {
  const category = categoriesService.getById(
    Number(req.params.id)
  );

  if (!category) {
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      "Category not found"
    );
  }

  return res.status(HTTP_STATUS.OK).json({
    message: "Category retrieved successfully",
    data: category,
  });
};

// Creates a new category using the name provided in the request body.
export const createCategory = (
  req: Request,
  res: Response
) => {
  const category = categoriesService.create(req.body.name);

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Category created successfully",
    data: category,
  });
};
