import { View, Text, TextInput, FlatList, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from '../static/styles';
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useRef, useState } from "react";
import authContext from '../components/AuthContext';
import { fetchRecipes, readRecipes } from "../utils/recipe";
import { useNavigation } from "@react-navigation/native";

const RecipeList = () => {
  const navigation = useNavigation();

  const {user} = useContext(authContext);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");

  let searchTimeout = useRef(null);
  let loadingTimeout = useRef(null);


  // Get recipe data
  useEffect(() => {
    if (user.isGuest) { // Guest user -> get data from the local storage
      readRecipes(setRecipes);
    } else { // Logged in user -> get data from the server
      fetchRecipes(user.token, setRecipes);
    }
  }, []);

  // Recipe state changed
  useEffect(() => {
    setLoading(recipes.length == 0); // Loading if there are no recipes
    
    if (loadingTimeout.current) clearTimeout(loadingTimeout.current); // Refresh timeout
    if (recipes.length == 0) {
      // Mark user's recipe list as empty if no recipes show up after 3 (might change) seconds
      loadingTimeout.current = setTimeout(() => {
        setIsEmpty(true);
        setLoading(false);
      }, 3000);
    }
  }, [recipes])

  // Update search phrase state after user doesn't input any character in 1.5 seconds
  function updateSearchPhrase(phrase) {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearchPhrase(phrase), 1500);
  }

  // One recipe componenent on the list
  const renderRecipe = ({item}) => (
    <TouchableOpacity style={staticStyles.recipeCard} onPress={() => navigation.navigate("Recipe", {recipe: item})}>

      <View style={staticStyles.recipeTextContainer}>
        <Text style={staticStyles.category}>{item.categories.map(category => category.name + " ")}</Text>
        <Text style={staticStyles.name}>{item.title}</Text>
        <Text style={staticStyles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>My recipes</Text>

        <View style={staticStyles.searchContainer}>
          <TextInput 
            style={staticStyles.searchInput}
            placeholder="Search recipe"
            placeholderTextColor="black"
            onChangeText={updateSearchPhrase}
          />
          <Image 
            source={require('../static/img/search.png')}
            style={staticStyles.searchIcon}
          />
        </View>

        <View style={staticStyles.mainContent}>
          <View style={staticStyles.listContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#6A569E" style={staticStyles.loader}/>
            ) : (
              isEmpty ? (
                <View style={[staticStyles.centered, {gap: 10}]}>
                  <Text style={{fontSize: 16}}>You don't have any recipes yet.</Text> 
                  <TouchableOpacity onPress={() => navigation.navigate("Add Recipe")}>
                    <Text style={{fontSize: 16, color: "blue"}}>Add one</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={recipes.filter(recipe => recipe.title.toLowerCase().includes(searchPhrase))}
                  keyExtractor={(item) => item.id}
                  renderItem={renderRecipe}
                />
              )
            )}
          </View>
        </View>
      </View>
      {isEmpty || loading ? null : (
        <TouchableOpacity style={{position: "absolute", bottom: 100, right: 20}} onPress={() => navigation.navigate("Add Recipe")}>
          <Text>Add Recipe</Text>
        </TouchableOpacity>
      )}
      <Navigation activeTab="Recipe List"/>
    </SafeAreaView>
  )
}

export default RecipeList;