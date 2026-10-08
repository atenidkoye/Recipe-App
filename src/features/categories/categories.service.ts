import { categoriesRepository } from "./categories.repository.js";

export const categoriesService = {
  getAll() {
    return categoriesRepository.findAll();
  },

  getById(id: number) {
    const category = categoriesRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  },

  create(name: string) {
    if (!name || !name.trim()) {
      throw new Error("Category name is required");
    }

    return categoriesRepository.create({
      name: name.trim()
    });
  }
};