import { deleteUserData, setUserData } from "./db";
import { Alert } from "react-native";
import User from "./types/user";

/**
 * Sends POST API request to the server with email address and password to login a user.
 * 
 * After successfull login, user data is saved to a local storage for next logins.
 * In case of a failed login, the user is informed about the reason via alert pop up.
 * 
 * @param {string} email Email inputted by the user  
 * @param {string} password Password inputted by the user
 * @param {function} setUser Set state function for setting user after successfull login
 */
export const login = async (email, password, setUser) => {

  // POST API call to login
  const response = await fetch("http://10.0.2.2:4000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email: email, password: password})
  })
  
  const body = await response.json();

  if (response.ok) { // Store user in local storage and continue
    let data = body.data;
    const user = new User(User.NOT_GUEST, data.user.id, data.user.name, data.user.email, data.token);
    await setUserData(user);
    setUser(user);
  } else {
    Alert.alert("Error", body.message);
  }
}


/**
 * Sends POST API request to the server with name, email address and password to register a user.
 * 
 * After successfull registration, user data is saved to a local storage for next logins.
 * In case of a failed registration, the user is informed about the reason via alert pop up.
 * 
 * @param {string} name Name inputted by the user
 * @param {string} email Email inputted by the user  
 * @param {string} password Password inputted by the user
 * @param {function} setUser Set state function for setting user after successfull registration
 */
export const register = async (name, email, password, setUser) => {

  // POST API call to register
  const response = await fetch("http://10.0.2.2:4000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email: email, password: password, name: name})
  })
  
  const body = await response.json();

  if (response.ok) { // Store new user in local storage and continue
    let data = body.data;
    const user = new User(User.NOT_GUEST, data.user.id, data.user.name, data.user.email, data.token);
    await setUserData(user);
    setUser(user);
  } else {
    Alert.alert("Error", body.message);
  }
}


/**
 * Logs user in as a guest. Recipes of this user get saved only in the local storage.
 * 
 * @param {function} setUser Set state function to set user to a guest account 
 */
export const continueAsGuest = async (setUser) => {
  await deleteUserData(); // Delete old user data from local storage
  setUser(new User());
}


/**
 * Logs user out of their account.
 * 
 * @param {function} setUser Set state function to reset user
 */
export const logout = async (setUser) => {
  await deleteUserData(); // Delete old user data from local storage
  setUser(null);
}

export const isTokenValid = async (token) => {
  const response = await fetch("http://10.0.2.2:4000/api/auth/validation", {
    method: "GET",
    headers: {
      "authorization": `Bearer ${token}`
    },
    signal: AbortSignal.timeout(5000)
  });

  return response.ok;
}