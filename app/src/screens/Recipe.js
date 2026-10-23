import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext } from "react";
import { minutesToHoursAndMinutes } from "../utils/convertor";
import { useNavigation } from "@react-navigation/native";
import TextButton from "../components/TextButton";
import IconButton from "../components/IconButton";
import img from "../static/img";
import RecipeType from "../utils/types/recipe";
import AuthContext from "../components/AuthContext";
import { deleteLocalRecipe } from "../utils/localDBConn";
import ShoppingItem from '../utils/types/shopping_list'

const Recipe = ({ route }) => {
  // Provides navigation methods for moving between screens.
  const navigation = useNavigation();

  // Gets the current user's information from the authentication context.
  const { user } = useContext(AuthContext);

  // Gets the recipe passed from the previous screen.
  const isUserRecipe = route.params.isUserRecipe;

  // Create recipe object
  const recipeParam = route.params.recipe;

  // Creates a Recipe object and restores its related data.
  let recipe;
  recipe = new RecipeType({ ...recipeParam });
  recipe.categories = recipeParam.categories;
  recipe.ingredients = recipeParam.ingredients;
  recipe.isFavourite = recipeParam.isFavourite;

  // Splits the instructions into individual steps using newline characters.
  const instructionsList = recipe.instructions
    ? recipe.instructions.split("\n")
    : [];

  // Deletes the recipe and returns to the recipe list if deletion succeeds.
  const deleteRecipe = async () => {
    let success;
    if (user.isGuest) {
      success = await deleteLocalRecipe(recipe.id);
    } else {
      success = await recipe.delete.data(user.token);
    }

    if (success) {
      navigation.navigate("Recipe List");
    }
  };

  // const addRecipe = async () => {
  //   Alert.alert("Error", "Under maintenance");
  //   return;
  //   let success = await recipe.add.data(user.token);
  //   if (success) {
  //     Alert.alert("Sucess", `Successfully added ${recipe.title} to your recipes.`)
  //   }
  // }

  // Add ingredients of the recipe to the shopping list
  // due to the structure of shopping list, to make sure data are sending correctly, they should be sent like "Title: item" (Cake: Sugar)
  const addToShoppingList = async () => {
    let success = true;
    for (const ingredient of recipe.ingredients) {
      // putting quantity and units into the single line
      const quantity = ingredient.quantity ? `${ingredient.quantity}` : "";
      const unit = ingredient.unit ? `${ingredient.unit}` : "";

      // sticking recipe title and ingredients (should output "Cake: 200 g Sugar")
      const fullItem = `${recipe.title.trim()}: ${quantity} ${unit} ${ingredient.name.trim()}`;

      // Create item to add to the shopping list
      let shoppingItem = new ShoppingItem({name: fullItem, quantity: ingredient.quantity, unit: ingredient.unit});
      const result = await shoppingItem.add.data(user.token);

      if (!result) {
        success = false;
      }
    }
    if (success) {
      navigation.navigate("Shopping List");
    }
  }

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        {/* Displays the recipe title at the top of the screen. */}
        <Text style={staticStyles.headerText}>{recipe.title}</Text>

        {/* Allows the recipe details to scroll vertically. */}
        <ScrollView
          style={staticStyles.editorForm}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Displays the recipe description and categories. */}
          <View style={staticStyles.editorFormPart}>
            <Text style={staticStyles.editorMainLabel}>About</Text>

            {/* Shows the description only when one is available. */}
            {recipe.description ? (
              <Text style={styles.descriptionText}>
                {recipe.description}
              </Text>
            ) : null}

            {/* Displays each category assigned to the recipe. */}
            {recipe.categories && recipe.categories.length > 0 && (
              <View style={styles.categoriesContainer}>
                {recipe.categories.map((category, index) => (
                  <Text style={staticStyles.editorCategory} key={index}>
                    {category.name}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Displays the number of servings and cooking time. */}
          <View style={staticStyles.editorFormPart}>
            <Text style={staticStyles.editorMainLabel}>Details</Text>

            <View style={styles.detailsRow}>
              <View style={styles.detailBox}>
                <Text style={staticStyles.label}>Servings</Text>
                <Text style={styles.detailValue}>{recipe.servings}</Text>
              </View>

              <View style={styles.detailBox}>
                <Text style={staticStyles.label}>Cooking time</Text>
                <Text style={styles.detailValue}>
                  {minutesToHoursAndMinutes(recipe.cooking_time)}
                </Text>
              </View>
            </View>
          </View>

          {/* Lists the ingredients, including their quantities and units. */}
          <View style={staticStyles.editorFormPart}>
            <Text style={staticStyles.editorMainLabel}>Ingredients</Text>

            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>.</Text>
                  <Text style={styles.itemText}>
                    <Text style={styles.boldText}>
                      {ingredient.quantity} {ingredient.unit}
                    </Text>
                    {ingredient.quantity || ingredient.unit ? " " : ""}
                    {ingredient.name}
                  </Text>
                </View>
              ))
            ) : (
              // Displays a message when the recipe has no ingredients.
              <Text style={styles.emptyText}>No ingredients added</Text>
            )}
          </View>

          {/* Displays the cooking instructions as numbered steps. */}
          <View style={staticStyles.editorFormPart}>
            <Text style={staticStyles.editorMainLabel}>Instructions</Text>

            {instructionsList.length > 0 ? (
              instructionsList.map((step, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.stepNumber}>{index + 1}.</Text>
                  <Text style={styles.itemText}>{step}</Text>
                </View>
              ))
            ) : (
              // Displays a message when no instructions are available.
              <Text style={styles.emptyText}>No instructions added</Text>
            )}
          </View>

          {/* Provides actions to go back, delete, or edit the recipe. */}
          <View style={[staticStyles.editorButtons, { marginTop: 10 }]}>
            <TextButton
              style={[
                staticStyles.editorButton,
                staticStyles.confirmButton,
                { width: "60%" },
              ]}
              buttonText="Go Back"
              onPress={() => navigation.goBack()}
            />

            {/* Deletes the current recipe. */}
            <IconButton
              style={staticStyles.cancelButton}
              icon={img.delete}
              iconStyle={{ filter: [{ invert: 0.9 }] }}
              onPress={deleteRecipe}
            />
                
            <IconButton style={{backgroundColor: "#367a09"}} icon={img.cart} iconStyle={{filter: [{invert: 0.9}]}} onPress={addToShoppingList} />

            {/* Opens the recipe editor with the current recipe data. */}
            <IconButton
              style={{ backgroundColor: "#FF8000" }}
              icon={img.edit}
              iconStyle={{ filter: [{ invert: 0.9 }] }}
              onPress={() =>
                navigation.navigate("Edit Recipe", {
                  recipe: typeof recipe.getData === 'function' ? recipe.getData() : recipe,
                })
              }
            />
          </View>
        </ScrollView>
      </View>

      {/* Displays the app's main navigation. */}
      <Navigation />
    </SafeAreaView>
  );
};

// Defines styles used specifically by the recipe details screen.
const styles = StyleSheet.create({
  descriptionText: {
    fontsize: 16,
    color: "#333333",
    lineHeight: 16,
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 5,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 40,
    marginTop: 5,
  },
  detailBox: {
    alignItems: "flex-start",
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#554A6B",
    marginTop: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingRight: 15,
  },
  bullet: {
    fontSize: 18,
    color: "#6A569E",
    marginRight: 10,
    lineHeight: 22,
  },
  stepNumber: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 22,
    flex: 1,
  },
  boldText: {
    fontWeight: "bold",
    color: "#554A6B",
  },
  emptyText: {
    fontSize: 14,
    color: "#888888",
    fontStyle: "italic",
  },
});

export default Recipe;
