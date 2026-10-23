import { View, Text, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import staticStyles from "../static/styles";
import TextButton from "../components/TextButton";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { minutesToHoursAndMinutes } from "../utils/convertor";
import IconButton from "../components/IconButton";
import img from "../static/img";
import TimeModal from "../components/TimeModal";
import CategoryModal from "../components/CategoryModal";
import AuthContext from '../components/AuthContext';
import Recipe from "../utils/types/recipe";
import { Alert } from "react-native";
import { deleteLocalRecipe, saveLocalRecipe } from "../utils/localDBConn";

const RecipeEditor = ({route}) => {
  const navigation = useNavigation();

  const { user } = useContext(AuthContext);

  const recipeParam = route.params.recipe;
  const editing = Boolean(recipeParam);

  let recipe;
  if (editing) {
    recipe = new Recipe({...recipeParam});
    recipe.categories = recipeParam.categories;
    recipe.ingredients = recipeParam.ingredients;
    recipe.isFavourite = recipeParam.isFavourite;
  }

  const [timeModalActive, setTimeModalActive] = useState(false);
  const [categoryModalActive, setCategoryModalActive] = useState(false);

  const [isPublic, setIsPublic] = useState(editing ? recipe.is_public : false);
  const [title, setTitle] = useState(editing ? recipe.title : "");
  const [desc, setDesc] = useState(editing ? recipe.description : "");
  const [servings, setServings] = useState(editing ? recipe.servings : 1);
  const [cookingTime, setCookingTime] = useState(editing ? recipe.cooking_time : 0);
  const [ingredients, setIngredients] = useState(editing ? [...recipe.ingredients] : []);
  const [instructions, setInstructions] = useState(editing ? recipe.instructions.split("\n") : []);
  const [categories, setCategories] = useState(editing ? [...recipe.categories] : []);

  // Update ingredient state
  const updateIngredients = (text, index, type, target = null) => {
    let temp = ingredients;
    if (index >= ingredients.length) { // Add a new ingredient
      temp.push({"name": text, "quantity": "", "unit": ""});
    } else { // Update ingredient field
      temp[index][type] = text;
    }
    setIngredients([...temp]);
    if (target) target.clear(); // Clear text input if adding new ingredient
  }

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => index != i))
  }

  // Update instructions state
  const updateInstructions = (text, index, target = null) => {
    let temp = instructions;
    if (index >= instructions.length) { // Add a new instruction
      temp.push(text);
    } else { // Update instruction text
      temp[index] = text;
    }
    setInstructions([...temp]);
    if (target) target.clear(); // Clear text input if adding a new instruction
  }

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => index != i))
  }
  
  const deleteRecipe = async () => {
    let success;
    if (user.isGuest) {
      success = await deleteLocalRecipe(recipe.id);
    } else {
      success = await recipe.delete.data(user.token);
    }

    if (success) { // Navigate to recipe list after successfull recipe deletion
      navigation.navigate("Recipe List");
    }
  }

  
  const saveRecipe = async () => {
    // Create a recipe object to save
    const newRecipe = new Recipe({
      id: editing ? recipe.id : null,
      title,
      description: desc,
      instructions: instructions.join("\n"),
      cooking_time: cookingTime,
      servings,
      is_public: Number(isPublic),
    });

    // Add categories and ingredients
    newRecipe.categories = categories;
    newRecipe.ingredients = ingredients;

    try {
      let success;

      if (user.isGuest) {
        const localId = await saveLocalRecipe(newRecipe, user.id);
        newRecipe.id = localId;
        success = true;
      } else if (editing) {
        success = await recipe.edit.data(user.token, newRecipe);
      } else {
        success = await newRecipe.add.data(user.token);
      }

      if (success) {
        navigation.navigate("Recipe List");
      }
    } catch (error) {
      console.error("Failed to save recipe:", error);
      Alert.alert("Save failed", "The recipe could not be saved.");
    }
  };


  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>{editing ? "Edit" : "Add"} Recipe</Text>
        <ScrollView style={staticStyles.editorForm}>
          <View style={staticStyles.editorFormPart}>
            <Text style={staticStyles.editorMainLabel}>Main information</Text>

            {/* Public/Private switch button */}
            <View style={{position: "absolute", top: 10, right: 10, flexDirection: "row", gap: 10}}>
              <TextButton
                buttonText={isPublic ? "Make private" : "Make public"}
                onPress={() => setIsPublic(!isPublic)}
                style={staticStyles.editorPublicButton}
                textStyle={{fontSize: 14}}
              />
            </View>
            
            {/* Title */}
            <Text style={staticStyles.label}>Name</Text>
            <TextInput placeholder="Name of the recipe..." value={title} onChangeText={setTitle} style={staticStyles.editorInput} />
            
            {/* Description */}
            <Text style={staticStyles.label}>Description</Text>
            <TextInput 
              placeholder="Short description of the recipe..." 
              value={desc}
              onChangeText={setDesc}
              multiline={true}
              style={[staticStyles.editorInput, staticStyles.editorBigInput]}
            />

            {/* Categories */}
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Text style={{fontSize: 18}}>Categories</Text>
              <IconButton icon={img.edit} onPress={() => setCategoryModalActive(true)} />
            </View>
            {categories.length == 0 ? <Text>No categories yet.</Text> : <View style={{flexDirection: "row", gap: 5}}>
              {categories.map((category, index) => <Text style={staticStyles.editorCategory} key={index}>{category.name}</Text>)}  
            </View>}
            <CategoryModal 
              active={categoryModalActive}
              setActive={setCategoryModalActive}
              activeCategories={categories}
              setActiveCategories={setCategories}
            />
          </View>


          <View style={staticStyles.editorFormPart}>
            <Text style={staticStyles.editorMainLabel}>Additional information</Text>
            <View style={staticStyles.editorNumericInfo}>

              {/* Servings */}
              <View style={staticStyles.editorLabelAndInput}>
                <Text style={staticStyles.label}>Servings</Text>
                <View style={staticStyles.editorServings}>
                  <IconButton icon={img.minus} iconStyle={{width: 16, height: 16}} onPress={() => setServings(Math.max(1, servings - 1))} />
                  <Text style={{fontWeight: "bold", fontSize: 20}}>{servings}</Text>
                  <IconButton icon={img.plus} iconStyle={{width: 16, height: 16}} onPress={() => setServings(servings + 1)} />
                </View>
              </View>

              {/* Cooking time */}
              <View style={staticStyles.editorLabelAndInput}>
                <Text style={staticStyles.label}>Cooking time</Text>
                <TextButton 
                  textStyle={{fontWeight: "bold", fontSize: 20, color: "black"}} 
                  buttonText={minutesToHoursAndMinutes(cookingTime)} 
                  onPress={() => setTimeModalActive(true)} 
                /> 
                <TimeModal time={cookingTime} setTime={setCookingTime} active={timeModalActive} setActive={setTimeModalActive} />
              </View>

            </View>
          </View>

          {/* Ingredients */}
          <View style={staticStyles.editorFormPart}>
            <Text style={staticStyles.editorMainLabel}>Ingredients</Text>
            {ingredients.map((ingredient, index) => <View style={staticStyles.editorMultiRow} key={index}>
              
              {/* Ingredient name */}
              <TextInput 
                value={`${ingredient.name}`} 
                placeholder="Ingredient..."
                style={[staticStyles.editorInput, {marginBottom: 5, width: "40%"}]}
                onChangeText={(text) => updateIngredients(text, index, "name")}
                onEndEditing={() => !ingredient.name && !ingredient.amount && !ingredient.unit ? removeIngredient(index) : null}
              />

              {/* Ingredient quantity */}
              <TextInput 
                value={`${ingredient.quantity}`} 
                placeholder="Qty..."
                style={[staticStyles.editorInput, {marginBottom: 5, width: "17%"}]}
                onChangeText={(text) => updateIngredients(text, index, "quantity")}
                onEndEditing={() => !ingredient.name && !ingredient.quantity && !ingredient.unit ? removeIngredient(index) : null}
              />

              {/* Ingriedient unit */}
              <TextInput 
                value={`${ingredient.unit}`}
                placeholder="Unit..." 
                style={[staticStyles.editorInput, {marginBottom: 5, width: "20%"}]}
                onChangeText={(text) => updateIngredients(text, index, "unit")}
                onEndEditing={() => !ingredient.name && !ingredient.amount && !ingredient.unit ? removeIngredient(index) : null}
              />

              {/* Remove ingredient button */}
              <IconButton
                icon={img.delete}
                iconStyle={{filter: [{invert: 0.9}]}}
                onPress={() => removeIngredient(index)}
                style={[staticStyles.cancelButton, staticStyles.editorIconButton]}
              />
            </View>)}

            {/* New ingredient */}
            <TextInput
              placeholder={`Next ingredient...`} 
              style={[staticStyles.editorInput, {marginBottom: 5}]} 
              onEndEditing={(e) => e.nativeEvent.text ? updateIngredients(e.nativeEvent.text, ingredients.length, "text", e.currentTarget) : null}
            />
          </View>

          {/* Instructions */}
          <View style={staticStyles.editorFormPart}>
            <Text style={staticStyles.editorMainLabel}>Instructions</Text>
            {instructions.map((instruction, index) => <View key={index} style={staticStyles.editorMultiRow}>
              
              {/* Instruction text */}
              <TextInput 
                value={`${instruction}`} 
                placeholder="Step..."
                style={[staticStyles.editorInput, {marginBottom: 5, width: "85%"}]}
                onChangeText={(text) => updateInstructions(text, index)}
                onEndEditing={() => !instruction ? removeInstruction(index) : null}
              />

              {/* Remove instruction button */}
              <IconButton 
                icon={img.delete}
                iconStyle={{filter: [{invert: 0.9}]}}
                onPress={() => removeInstruction(index)}
                style={[staticStyles.cancelButton, staticStyles.editorIconButton]}
              />
            </View>)}

            {/* New instruction */}
            <TextInput
              placeholder={`Next step...`} 
              style={[staticStyles.editorInput, {marginBottom: 5}]} 
              onEndEditing={(e) => e.nativeEvent.text ? updateInstructions(e.nativeEvent.text, instructions.length, e.currentTarget) : null}
            />
          </View>
        </ScrollView>
      </View>

      {/* Buttons */}
      <View style={staticStyles.editorButtons}>

        {/* Recipe can be deleted only if it's already created */}
        { editing ? <IconButton style={staticStyles.cancelButton} icon={img.delete} iconStyle={{filter: [{invert: 0.9}]}} onPress={deleteRecipe} /> : null }
        <TextButton style={[staticStyles.editorButton, staticStyles.cancelButton]} buttonText="Cancel" onPress={() => navigation.goBack()} />
        <TextButton style={[staticStyles.editorButton, staticStyles.confirmButton]} buttonText="Save" onPress={saveRecipe} />
      </View>
    </SafeAreaView>
  )
}

export default RecipeEditor;