export const fetchRecipes = async (user, setRecipes) => {
  const response = await fetch('http://10.0.2.2:4000/api/recipes/user/me', {
    method: "GET",
    headers: {
      "authorization": `Bearer: ${user.token}`
    }
  });

  const data = await response.json();

  data.forEach(async (recipe) => {
    recipe["categories"] = await fetchCategories(recipe.id);
    recipe["ingredients"] = await fetchIngredients(recipe.id);
  });

  setRecipes(data);
}

const fetchCategories = async (id) => {
  const response = await fetch(`http://10.0.2.2:4000/api/recipes/${id}/categories`);
  return await response.json();
}

const fetchIngredients = async (id) => {
  const response = await fetch(`http://10.0.2.2:4000/api/ingredients/recipe/${id}`);
  return await response.json();
}