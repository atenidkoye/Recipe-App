import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {minutesToHoursAndMinutes} from '../utils/convertor';
import { useNavigation } from "@react-navigation/native";
import TextButton from '../components/TextButton';
import IconButton from "../components/IconButton";
import img from "../static/img";
import RecipeType from "../utils/types/recipe";
import AuthContext from "../components/AuthContext";
import { useContext } from "react";
import ShoppingItem from '../utils/types/shopping_list'

const Recipe = ({route}) => {

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const isUserRecipe = route.params.isUserRecipe;

  const recipeParam = route.params.recipe;
  let recipe;
  recipe = new RecipeType({...recipeParam});
  recipe.categories = recipeParam.categories;
  recipe.ingredients = recipeParam.ingredients;
  recipe.isFavourite = recipeParam.isFavourite;
    

  const instructionsList = recipe.instructions ? recipe.instructions.split("\n") : [];

  const deleteRecipe = async () => {
    let success = await recipe.delete.data(user.token);
    if (success) {
      navigation.navigate("Recipe List");
    }
  }

  const addRecipe = async () => {
    Alert.alert("Error", "Under maintenance");
    return;
    let success = await recipe.add.data(user.token);
    if (success) {
      Alert.alert("Sucess", `Successfully added ${recipe.title} to your recipes.`)
    }
  }

  const addToShoppingList = async () => {
    let success = true;
    for (let index in recipe.ingredients) {
      let ingredient = recipe.ingredients[index];
      let shoppingItem = new ShoppingItem({name: ingredient.name, quantity: ingredient.quantity, unit: ingredient.unit})
      success = shoppingItem.add.data(user.token);
    }

    if (success) {
      navigation.navigate("Shopping List");
    }
  }

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>{recipe.title}</Text>
        <ScrollView
        style={staticStyles.editorForm}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}
        >
        <View style={staticStyles.editorFormPart}>
          <Text style={staticStyles.editorMainLabel}>About</Text>
          {recipe.description ? (
            <Text style={styles.descriptionText}>{recipe.description}</Text>
          ) : null}

          {recipe.categories && recipe.categories.length > 0 && (
            <View style={styles.categoriesContainer}>
              {recipe.categories.map((category, index) => (
                <Text style={staticStyles.editorCategory} key={index}>{category.name}</Text>
              ))}
            </View>
          )}
        </View>

        <View style={staticStyles.editorFormPart}>
          <Text style={staticStyles.editorMainLabel}>Details</Text>
          <View style={styles.detailsRow}>
            <View style={styles.detailBox}>
              <Text style={staticStyles.label}>Servings</Text>
              <Text style={styles.detailValue}>{recipe.servings}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={staticStyles.label}>Cooking time</Text>
              <Text style={styles.detailValue}>{minutesToHoursAndMinutes(recipe.cooking_time)}</Text>
            </View>
          </View>
        </View>

        <View style={staticStyles.editorFormPart}>
          <Text style={staticStyles.editorMainLabel}>Ingredients</Text>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>.</Text>
                <Text style={styles.itemText}>
                  <Text style={styles.boldText}>{ingredient.quantity} {ingredient.unit}</Text>
                  {ingredient.quantity || ingredient.unit ? " " : ""}
                  {ingredient.name}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No ingredients added</Text>
          )}
        </View>

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
            <Text style={styles.emptyText}>No instructions added</Text>
          )}
        </View>
        <View style={[staticStyles.editorButtons, {marginTop: 10}]}>
          <TextButton style={[staticStyles.editorButton, staticStyles.confirmButton, {width: isUserRecipe ? "55%" : "80%"}]} buttonText="Go Back" onPress={() => navigation.goBack()} />
          {isUserRecipe ? <IconButton style={staticStyles.cancelButton} icon={img.delete} iconStyle={{filter: [{invert: 0.9}]}} onPress={deleteRecipe} /> : null }
          <IconButton style={{backgroundColor: "#367a09"}} icon={img.cart} iconStyle={{filter: [{invert: 0.9}]}} onPress={addToShoppingList} />
          {isUserRecipe ? <IconButton style={{backgroundColor: "#FF8000"}} icon={img.edit} iconStyle={{filter: [{invert: 0.9}]}} onPress={() => navigation.navigate("Edit Recipe", {recipe: recipe.getData()})} /> : null }
          {/* {!isUserRecipe ? <IconButton style={{backgroundColor: "#FF8000"}} icon={img.add} iconStyle={{filter: [{invert: 0.9}]}} onPress={addRecipe} /> : null } */}
        </View>
        </ScrollView>
      </View>
      
      <Navigation />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  descriptionText: {
    fontsize: 16,
    color: '#333333',
    lineHeight: 16,
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5, 
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 40,
    marginTop: 5,
  },
  detailBox: {
    alignItems: 'flex-start',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#554A6B',
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 15,
  },
  bullet: {
    fontSize: 18,
    color: '#6A569E',
    marginRight: 10,
    lineHeight: 22,
  },
  stepNumber: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#554A6B',
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
});

export default Recipe;