export const readRecipes = async (setRecipes) => {
  // TODO: Read recipe data from the local storage (SQLite)
  
  setRecipes([]);
}


/**
 * Fetches recipe data from the server on the user specific endpoint
 * 
 * @param {string} userToken Bearer token of the user used for authorization
 * @param {function} setRecipes Function to set recipes state
 */
export const fetchRecipes = async (userToken, setRecipes) => {
  const response = await fetch('http://10.0.2.2:4000/api/recipes/user/me', {
    method: "GET",
    headers: {
      "authorization": `Bearer: ${userToken}`
    }
  });

  const data = await response.json();

  // Add categories and ingredients to all the recipes
  data.forEach(async (recipe) => {
    recipe["categories"] = await fetchCategories(recipe.id);
    recipe["ingredients"] = await fetchIngredients(recipe.id);
  });

  setRecipes(data);
}


/**
 * Fetches categories of a recipe on a recipe specific endpoint
 * 
 * @param {number} id ID of the recipe 
 * @returns Array of categories
 */
const fetchCategories = async (id) => {
  const response = await fetch(`http://10.0.2.2:4000/api/recipes/${id}/categories`);
  return await response.json();
}

/**
 * Fetches ingredients of a recipe on a recipe specific endpoint
 * 
 * @param {number} id ID of the recipe 
 * @returns Array of ingredients
 */
const fetchIngredients = async (id) => {
  const response = await fetch(`http://10.0.2.2:4000/api/ingredients/recipe/${id}`);
  return await response.json();
} 