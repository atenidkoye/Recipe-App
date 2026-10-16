import { Alert } from "react-native";

/**
 * Fetches all public recipes from the server.
 * In case of an error the message is shown to the user via an alert popup.
 * 
 * @param {function} setRecipes Function to set recipes state
 */
export const fetchRecipes = async (setRecipes) => {

  // Fetch public recipes
  const response = await fetch('http://10.0.2.2:4000/api/recipes');

  const data = await response.json();

  // Inform user about error via alert popup
  if (!response.ok) {
    Alert.alert("Error", data.message);
  }

  // Add categories and ingredients to all the recipes
  data.forEach(async (recipe) => {
    recipe["categories"] = await fetchCategories(recipe.id);
    recipe["ingredients"] = await fetchIngredients(recipe.id);
    recipe["isFavourite"] = false;
  });

  setTimeout(() => setRecipes(data), 500);
}

export const readUserRecipes = async (setRecipes) => {
  // TODO: Read recipe data from the local storage (SQLite)
  
  setRecipes([]);
}


/**
 * Fetches recipe data from the server on the user specific endpoint.
 * In case of an error the message is shown to the user via an alert popup.
 * 
 * @param {string} userToken Bearer token of the user used for authorization
 * @param {function} setRecipes Function to set recipes state
 */
export const fetchUserRecipes = async (userToken, setRecipes) => {

  // Fetch recipes created by logged in user
  const response = await fetch('http://10.0.2.2:4000/api/recipes/user/me', {
    method: "GET",
    withCredentials: true,
    credentials: 'include',
    headers: {
      "authorization": `Bearer ${userToken}`
    }
  });

  const data = await response.json();

  // Inform user about error via alert popup
  if (!response.ok) {
    return Alert.alert("Error", data.message);
  }

  // Add categories and ingredients to all the recipes
  data.forEach(async (recipe) => {
    recipe["categories"] = await fetchCategories(recipe.id);
    recipe["ingredients"] = await fetchIngredients(recipe.id);
    recipe["isFavourite"] = await isRecipeFavourited(recipe.id, userToken);
  });

  setTimeout(() => setRecipes(data), 500);
}

/**
 * Add recipe to the user's favourites via recipe specific endpoint.
 * In case of an error the error message is shown to the user via an alert popup.
 * 
 * @param {string} userToken Bearer token of the user used for authorization
 * @param {object} recipe Recipe object to change the favourite status of
 * @returns {Promise<boolean>} Changed favourite status of the recipe
 */
export const updateFavourite = async (userToken, recipe) => {

  // API call to change the favourite status of a recipe
  const response = await fetch(`http://10.0.2.2:4000/api/favourites/${recipe.id}`, {
    method: recipe.isFavourite ? "DELETE" : "POST", // Already favourited recipe should lose the status and vice versa
    withCredentials: true,
    credentials: 'include',
    headers: {
      "authorization": `Bearer ${userToken}`
    }
  });

  // Inform user about error via alert popup
  if (!response.ok) {
    Alert.alert("Error", (await response.json()).message);
  } 

  return !recipe.isFavourite;
}


/**
 * Fetches categories of a recipe on a recipe specific endpoint
 * 
 * @param {number} id ID of the recipe 
 * @returns {Promise<Array>} Array of categories
 */
const fetchCategories = async (id) => {
  const response = await fetch(`http://10.0.2.2:4000/api/recipes/${id}/categories`);
  return await response.json();
}

/**
 * Fetches ingredients of a recipe on a recipe specific endpoint
 * 
 * @param {number} id ID of the recipe 
 * @returns {Promise<Array>} Array of ingredients
 */
const fetchIngredients = async (id) => {
  const response = await fetch(`http://10.0.2.2:4000/api/ingredients/recipe/${id}`);
  return await response.json();
} 

/**
 * Check whether recipe is favourited on a recipe specific endpoint.
 * 
 * @param {number} id ID of the recipe
 * @param {string} userToken Bearer token of the user used for authorization
 * @returns {Promise<boolean>} Favourite status of the recipe
 */
const isRecipeFavourited = async (id, userToken) => {
  const response = await fetch(`http://10.0.2.2:4000/api/favourites/${id}`, {
    headers: {
      "authorization": `Bearer ${userToken}`
    }
  });

  const data = await response.json();
  return data.isFavourite;
}

export const addRecipe = async (recipe, categories, ingredients, userToken) => {
  const response = await fetch('http://10.0.2.2:4000/api/recipes', {
    method: "POST",
    withCredentials: true,
    credentials: 'include',
    headers: {
      "authorization": `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe)
  });

  const body = await response.json();

  if (!response.ok) {
    Alert.alert("Erorr", body.message);
    return false;
  }
  
  let error = await addCategories(body, categories, userToken);
  if (error) {
    Alert.alert("Erorr", error);
    return false;
  }

  error = await addIngredients(body, ingredients, userToken);
  if (error) {
    Alert.alert("Erorr", error);
    return false;
  }

  return true;
}

export const editRecipe = async (oldRecipe, recipe, ingredients, categories, userToken) => {
  const response = await fetch(`http://10.0.2.2:4000/api/recipes/${recipe.id}`, {
    method: "PUT",
    withCredentials: true,
    credentials: 'include',
    headers: {
      "authorization": `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe)
  });

  if (!response.ok) {
    Alert.alert("Erorr", (await response.json()).message);
    return false;
  }

  let error = await editCategories(oldRecipe, categories, userToken);
  if (error) {
    Alert.alert("Erorr", error);
    return false;
  }

  error = await editIngredients(oldRecipe, ingredients, userToken);
  if (error) {
    Alert.alert("Erorr", error);
    return false;
  }

  return true;
}

const editCategories = async (oldRecipe, categories, userToken) => {

  let response;

  // Rmove old categories
  for (let index in oldRecipe.categories) {
    let category = oldRecipe.categories[index];

    response = await fetch(`http://10.0.2.2:4000/api/recipes/${oldRecipe.id}/categories/${category.id}`, {
      method: "DELETE",
      withCredentials: true,
      credentials: 'include',
      headers: {
        "authorization": `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      return (await response.json()).message;
    }
  }

  // Add new categories
  return await addCategories(oldRecipe, categories, userToken);
}

const addCategories = async (recipe, categories, userToken) => {

  let response;

  for (let index in categories) {
    let category = categories[index];

    response = await fetch(`http://10.0.2.2:4000/api/recipes/${recipe.id}/categories/${category.id}`, {
      method: "POST",
      withCredentials: true,
      credentials: 'include',
      headers: {
        "authorization": `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      return (await response.json()).message;
    }
  }

  return "";
}

const editIngredients = async (oldRecipe, ingredients, userToken) => {
  
  let response;

  // Remove old ingredients
  for (let index in oldRecipe.ingredients) {
    let ingredient = oldRecipe.ingredients[index];
    response = await fetch(`http://10.0.2.2:4000/api/ingredients/${ingredient.id}`, {
      method: "DELETE",
      withCredentials: true,
      credentials: 'include',
      headers: {
        "authorization": `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      return (await response.json()).message;
    }
  }

  return await addIngredients(oldRecipe, ingredients, userToken);
}

const addIngredients = async (recipe, ingredients, userToken) => {
  
  let response;
  
  // Add ingredients
  for (let index in ingredients) {
    let ingredient = ingredients[index];
    response = await fetch(`http://10.0.2.2:4000/api/ingredients/recipe/${recipe.id}`, {
      method: "POST",
      withCredentials: true,
      credentials: 'include',
      headers: {
        "authorization": `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingredient)
    });

    if (!response.ok) {
      return (await response.json()).message;
    }
  }

  return "";
}