import { Alert } from "react-native";

export class Recipe {
    id;
    title;
    description;
    instructions;
    cooking_time;
    servings;
    is_public;

    categories;
    ingredients;
    isFavourite;

    constructor({id, title, description, instructions, cooking_time, servings, is_public}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.instructions = instructions;
        this.cooking_time = cooking_time;
        this.servings = servings;
        this.is_public = is_public;
    }

    getData() {
        return { 
            id: this.id, 
            title: this.title, 
            description: this.description, 
            instructions: this.instructions, 
            cooking_time: this.cooking_time, 
            servings: this.servings, 
            is_public: this.is_public, 
            categories: this.categories, 
            ingredients: this.ingredients, 
            isFavourite: this.isFavourite 
        }
    }

    fetch = {
        categories: async () => {
            const response = await fetch(`http://10.0.2.2:4000/api/recipes/${this.id}/categories`);
            const body = await response.json();

            if (!response.ok) {
                Alert.alert("Error", body.message);
                return;
            } 
            this.categories = body;
        },

        ingredients: async () => {
            const response = await fetch(`http://10.0.2.2:4000/api/ingredients/recipe/${this.id}`);
            const body = await response.json();

            if (!response.ok) {
                Alert.alert("Error", body.message);
                return;
            }
            
            this.ingredients = body;
        },

        isFavourite: async (userToken) => {
            const response = await fetch(`http://10.0.2.2:4000/api/favourites/${this.id}`, {
                withCredentials: true,
                credentials: 'include',
                headers: {
                    "authorization": `Bearer ${userToken}`
                }
            });
        
            const data = await response.json();

            // had to turn off due to infinite error
            // if (!response.ok) {
            //     Alert.alert("Error", data.message); // changed from body.message due to error
            //     return;
            // }

            this.isFavourite = data.isFavourite;
        }
    };

    edit = {
        data: async (userToken, newRecipe) => {
            const response = await fetch(`http://10.0.2.2:4000/api/recipes/${this.id}`, {
                method: "PUT",
                withCredentials: true,
                credentials: 'include',
                headers: {
                    "authorization": `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newRecipe)
            });

            if (!response.ok) {
                Alert.alert("Erorr", (await response.json()).message);
                return false;
            }

            let error = await this.edit.categories(userToken, newRecipe);
            if (error) {
                Alert.alert("Error", error);
                return false;
            }

            error = await this.edit.ingredients(userToken, newRecipe);
            if (error) {
                Alert.alert("Error", error);
                return false;
            }

            return true;
        },

        isFavourite: async (userToken) => {
            const response = await fetch(`http://10.0.2.2:4000/api/favourites/${this.id}`, {
                method: this.isFavourite ? "DELETE" : "POST", // Already favourited recipe should lose the status and vice versa
                withCredentials: true,
                credentials: 'include',
                headers: {
                    "authorization": `Bearer ${userToken}`
                }
            });

            // Inform user about error via alert popup
            if (!response.ok) {
                Alert.alert("Error", (await response.json()).message);
                return this.isFavourite;
            } 

            return !this.isFavourite;
        },

        categories: async (userToken, newRecipe) => {
            let error = await this.delete.categories(userToken);

            if (error) {
                return error;
            }

            error = await newRecipe.add.categories(userToken);

            return error;
        },

        ingredients: async (userToken, newRecipe) => {
            let error = await this.delete.ingredients(userToken);

            if (error) {
                return error;
            }

            error = await newRecipe.add.ingredients(userToken);

            return error;
        }
    };

    add = {
        data: async (userToken) => {
            const response = await fetch(`http://10.0.2.2:4000/api/recipes`, {
                method: "POST",
                withCredentials: true,
                credentials: 'include',
                headers: {
                    "authorization": `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this)
            });

            const body = await response.json();
            this.id = body.id;

            // Check for error while saving the main recipe data
            if (!response.ok) {
                Alert.alert("Erorr", body.message);
                return false;
            }

            // Check for error while saving categories
            let error = await this.add.categories(userToken);
            if (error) {
                Alert.alert("Erorr", body.message);
                return false;
            }

            // Check for error while saving ingredients
            error = await this.add.ingredients(userToken);
            if (error) {
                Alert.alert("Erorr", body.message);
                return false;
            }

            // No error
            return true;
        },

        categories: async (userToken) => {
            for (let index in this.categories) {
                let category = this.categories[index];

                const response = await fetch(`http://10.0.2.2:4000/api/recipes/${this.id}/categories/${category.id}`, {
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
        },

        ingredients: async (userToken) => {
            for (let index in this.ingredients) {
                let ingredient = this.ingredients[index];
                const response = await fetch(`http://10.0.2.2:4000/api/ingredients/recipe/${this.id}`, {
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
    };

    delete = {
        data: async (userToken) => {
            let error = await this.delete.categories(userToken);

            if (error) {
                Alert.alert("Error", error);
                return false;
            }

            error = await this.delete.ingredients(userToken);
            
            if (error) {
                Alert.alert("Error", error);
                return false;
            }

            if (this.isFavourite) {
                error = await this.delete.isFavourite(userToken);
                if (error) {
                    Alert.alert("Error", error);
                    return false;
                }
            }

            const response = await fetch(`http://10.0.2.2:4000/api/recipes/${this.id}`, {
                method: "DELETE",
                withCredentials: true,
                credentials: 'include',
                headers: {
                    "authorization": `Bearer ${userToken}`,
                }
            });
            
            if (!response.ok) {
                Alert.alert("Error", (await response.json()).message);
                return false;
            }

            return true;
        },

        isFavourite: async (userToken) => {
            const response = await fetch(`http://10.0.2.2:4000/api/favourites/${this.id}`, {
                method: "DELETE", 
                withCredentials: true,
                credentials: 'include',
                headers: {
                    "authorization": `Bearer ${userToken}`
                }
            });

            // Inform user about error via alert popup
            if (!response.ok) {
                return (await response.json()).message;
            } 

            return "";
        },

        categories: async (userToken) => {
            for (let index in this.categories) {
                let category = this.categories[index];

                const response = await fetch(`http://10.0.2.2:4000/api/recipes/${this.id}/categories/${category.id}`, {
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

            return "";
        },

        ingredients: async (userToken) => {
            for (let index in this.ingredients) {
                let ingredient = this.ingredients[index];
                
                const response = await fetch(`http://10.0.2.2:4000/api/ingredients/${ingredient.id}`, {
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

            return "";
        }
    }
}