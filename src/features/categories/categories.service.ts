
import { categoriesRepository } from "./categories.repository.js";

// Handles category-related business logic.
export const categoriesService = {
  // Retrieves all categories from the repository.
  getAll() {
    return categoriesRepository.findAll();
  },

  // Retrieves a category by ID and throws an error if it does not exist.
  getById(id: number) {
    const category = categoriesRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  },

  // Validates the category name before saving it to the database.
  create(name: string) {
    if (!name || !name.trim()) {
      throw new Error("Category name is required");
    }

    return categoriesRepository.create({
      name: name.trim()
    });
  }
};
