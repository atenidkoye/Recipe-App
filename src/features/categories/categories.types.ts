
// Represents a category stored in the database.
export interface Category {
  id: number;
  name: string;
}

// Defines the data required to create a new category.
export interface CreateCategoryInput {
  name: string;
}
