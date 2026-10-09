import { View, Text, TextInput, FlatList, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from '../static/styles';
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useRef, useState } from "react";
import authContext from '../components/AuthContext';
import { fetchRecipes } from "../utils/recipe";
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

  useEffect(() => {
    fetchRecipes(user, setRecipes);
  }, []);

  useEffect(() => {
    setLoading(recipes.length == 0);
    
    if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
    if (recipes.length == 0) {
      loadingTimeout.current = setTimeout(() => {
        setIsEmpty(true);
        setLoading(false);
      }, 2000);
    }
  }, [recipes])

  function updateSearchPhrase(phrase) {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearchPhrase(phrase), 1500);
  }

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
                <Text>You don't have any recipes yet. <TouchableOpacity onPress={() => navigation.navigate("Add Recipe")}><Text>Add some</Text></TouchableOpacity></Text>
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
      <Navigation activeTab="Recipe List"/>
    </SafeAreaView>
  )
}

export default RecipeList;