import { View, Text, ScrollView, StyleSheet } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {minutesToHoursAndMinutes} from '../utils/convertor';

const Recipe = ({route}) => {

  const recipe = route.params.recipe;
  const instructionsList = recipe.instructions ? recipe.instructions.split("\n") : [];
  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>{recipe.title}</Text>
        <ScrollView
        style={staticStyles.editorForm}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
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