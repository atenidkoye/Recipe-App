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

  const updateIngredients = (text, index, type, target = null) => {
    let temp = ingredients;
    if (index >= ingredients.length) {
      temp.push({"name": text, "quantity": "", "unit": ""});
    } else {
      temp[index][type] = text;
    }
    setIngredients([...temp]);
    if (target) target.clear();
  }

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => index != i))
  }

  const updateInstructions = (text, index, target = null) => {
    let temp = instructions;
    if (index >= instructions.length) {
      temp.push(text);
    } else {
      temp[index] = text;
    }
    setInstructions([...temp]);
    if (target) target.clear();
  }

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => index != i))
  }
  
  const deleteRecipe = async () => {
    let success = await recipe.delete.data(user.token);
    if (success) {
      navigation.navigate("Recipe List");
    }
  }

  const saveRecipe = async () => {
    let success;
    
    let newRecipe = new Recipe({
      id: editing ? recipe.id : null,
      title: title,
      description: desc,
      instructions: instructions.reduceRight((prev, curr) => curr + "\n" + prev),
      cooking_time: cookingTime,
      servings: servings,
      is_public: Number(isPublic)
    });

    newRecipe.categories = categories;
    newRecipe.ingredients = ingredients;

    if (editing) {
      success = await recipe.edit.data(user.token, newRecipe);
    } else {
      success = await newRecipe.add.data(user.token);
    }

    if (success) {
      navigation.navigate("Recipe List");
    }
  }

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>{editing ? "Edit" : "Add"} Recipe</Text>
        <ScrollView style={staticStyles.editorForm}>
          <View style={staticStyles.editorFormPart}>
            <Text style={staticStyles.editorMainLabel}>Main information</Text>
            <View style={{position: "absolute", top: 10, right: 10, flexDirection: "row", gap: 10}}>
              <TextButton
                buttonText={isPublic ? "Make private" : "Make public"}
                onPress={() => setIsPublic(!isPublic)}
                style={staticStyles.editorPublicButton}
                textStyle={{fontSize: 14}}
              />
            </View>
            <Text style={staticStyles.label}>Name</Text>
            <TextInput placeholder="Name of the recipe..." value={title} onChangeText={setTitle} style={staticStyles.editorInput} />
            <Text style={staticStyles.label}>Description</Text>
            <TextInput 
              placeholder="Short description of the recipe..." 
              value={desc}
              onChangeText={setDesc}
              multiline={true}
              style={[staticStyles.editorInput, staticStyles.editorBigInput]}
            />
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
              <View style={staticStyles.editorLabelAndInput}>
                <Text style={staticStyles.label}>Servings</Text>
                <View style={staticStyles.editorServings}>
                  <IconButton icon={img.minus} iconStyle={{width: 16, height: 16}} onPress={() => setServings(Math.max(1, servings - 1))} />
                  <Text style={{fontWeight: "bold", fontSize: 20}}>{servings}</Text>
                  <IconButton icon={img.plus} iconStyle={{width: 16, height: 16}} onPress={() => setServings(servings + 1)} />
                </View>
              </View>
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
          <View style={staticStyles.editorFormPart}>
            <Text style={staticStyles.editorMainLabel}>Ingredients</Text>
            {ingredients.map((ingredient, index) => <View style={staticStyles.editorMultiRow} key={index}>
              <TextInput 
                value={`${ingredient.name}`} 
                placeholder="Ingredient..."
                style={[staticStyles.editorInput, {marginBottom: 5, width: "40%"}]}
                onChangeText={(text) => updateIngredients(text, index, "name")}
                onEndEditing={() => !ingredient.name && !ingredient.amount && !ingredient.unit ? removeIngredient(index) : null}
              />
              <TextInput 
                value={`${ingredient.quantity}`} 
                placeholder="Qty..."
                style={[staticStyles.editorInput, {marginBottom: 5, width: "17%"}]}
                onChangeText={(text) => updateIngredients(text, index, "quantity")}
                onEndEditing={() => !ingredient.name && !ingredient.quantity && !ingredient.unit ? removeIngredient(index) : null}
              />
              <TextInput 
                value={`${ingredient.unit}`}
                placeholder="Unit..." 
                style={[staticStyles.editorInput, {marginBottom: 5, width: "20%"}]}
                onChangeText={(text) => updateIngredients(text, index, "unit")}
                onEndEditing={() => !ingredient.name && !ingredient.amount && !ingredient.unit ? removeIngredient(index) : null}
              />
              <IconButton
                icon={img.delete}
                iconStyle={{filter: [{invert: 0.9}]}}
                onPress={() => removeIngredient(index)}
                style={[staticStyles.cancelButton, staticStyles.editorIconButton]}
              />
            </View>)}
            <TextInput
              placeholder={`Next ingredient...`} 
              style={[staticStyles.editorInput, {marginBottom: 5}]} 
              onEndEditing={(e) => e.nativeEvent.text ? updateIngredients(e.nativeEvent.text, ingredients.length, "text", e.currentTarget) : null}
            />
          </View>
          <View style={staticStyles.editorFormPart}>
            <Text style={staticStyles.editorMainLabel}>Instructions</Text>
            {instructions.map((instruction, index) => <View key={index} style={staticStyles.editorMultiRow}>
              <TextInput 
                value={`${instruction}`} 
                placeholder="Step..."
                style={[staticStyles.editorInput, {marginBottom: 5, width: "85%"}]}
                onChangeText={(text) => updateInstructions(text, index)}
                onEndEditing={() => !instruction ? removeInstruction(index) : null}
              />
              <IconButton 
                icon={img.delete}
                iconStyle={{filter: [{invert: 0.9}]}}
                onPress={() => removeInstruction(index)}
                style={[staticStyles.cancelButton, staticStyles.editorIconButton]}
              />
            </View>)}
            <TextInput
              placeholder={`Next step...`} 
              style={[staticStyles.editorInput, {marginBottom: 5}]} 
              onEndEditing={(e) => e.nativeEvent.text ? updateInstructions(e.nativeEvent.text, instructions.length, e.currentTarget) : null}
            />
          </View>
        </ScrollView>
      </View>
      <View style={staticStyles.editorButtons}>
        { editing ? <IconButton style={staticStyles.cancelButton} icon={img.delete} iconStyle={{filter: [{invert: 0.9}]}} onPress={deleteRecipe} /> : null }
        <TextButton style={[staticStyles.editorButton, staticStyles.cancelButton]} buttonText="Cancel" onPress={() => navigation.goBack()} />
        <TextButton style={[staticStyles.editorButton, staticStyles.confirmButton]} buttonText="Save" onPress={saveRecipe} />
      </View>
    </SafeAreaView>
  )
}

export default RecipeEditor;