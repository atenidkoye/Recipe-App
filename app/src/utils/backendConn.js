import { Alert } from "react-native";
import Recipe from "./types/recipe";

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

  let recipes = [];

  // Add additional data to the recipe object
  for (let index in data) {
    let recipe = new Recipe(data[index]);
    await recipe.fetch.categories();
    await recipe.fetch.ingredients();
    recipe.isFavourite = false;
    recipes.push(recipe);
  }

  setRecipes(recipes);
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

  let recipes = [];

  // Add additional data to the recipe object
  for (let index in data) {
    let recipe = new Recipe(data[index]);
    await recipe.fetch.categories();
    await recipe.fetch.ingredients();
    await recipe.fetch.isFavourite(userToken);
    recipes.push(recipe);
  }

  setRecipes(recipes);
}

/**
 * Fetches all avaiable food categories
 * 
 * @returns {Promise<Array>} Array of categories
 */
export const fetchCategories = async () => {
  const response = await fetch('http://10.0.2.2:4000/api/categories');
  const body = await response.json();

  return body;
}