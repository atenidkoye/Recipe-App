import { View, Text, TextInput, FlatList, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from '../static/styles';
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useRef, useState } from "react";
import authContext from '../components/AuthContext';
import { fetchRecipes, fetchUserRecipes } from "../utils/backendConn";
import { readUserRecipes } from '../utils/localDBConn';
import { useNavigation } from "@react-navigation/native";
import RecipeListItem from '../components/RecipeListItem';
import TextButton from "../components/TextButton";

const RecipeList = ({route}) => {
  const navigation = useNavigation();

  const { user } = useContext(authContext);
  const { isUserList } = route.params;

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");

  let searchTimeout = useRef(null);
  let loadingTimeout = useRef(null);

  // Get recipe data
  useEffect(() => {
    if (!isUserList) {
      fetchRecipes(setRecipes);
    } else {
      if (user.isGuest) { // Guest user -> get data from the local storage
        readUserRecipes(setRecipes);
      } else { // Logged in user -> get data from the server
        fetchUserRecipes(user.token, setRecipes);
      }
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
  

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>{isUserList ? "My" : "Featured"} recipes</Text>

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
                  <Text style={{fontSize: 16, textAlign: "center"}}>{isUserList ? "You don't have any recipes yet." : "Sorry, something went wrong and we couldn't load public recipes."}</Text> 
                  <TouchableOpacity onPress={() => navigation.navigate(isUserList ? "Add Recipe" : "Recipe List")}>
                    <Text style={{fontSize: 16, color: "blue"}}>{isUserList? "Add one" : "Browse your recipes"}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={recipes.filter(recipe => recipe.title.toLowerCase().includes(searchPhrase))}
                  keyExtractor={(item) => item.id}
                  renderItem={(item) => <RecipeListItem item={item.item} />}
                />
              )
            )}
          </View>
        </View>
      </View>
      {!isUserList || isEmpty || loading ? null : (
        <TextButton 
          style={staticStyles.listAddButton} 
          onPress={() => navigation.navigate("Add Recipe")} 
          buttonText="Add Recipe"
          textStyle={{fontSize: 16}}
        />
      )}
      <Navigation activeTab="Recipe List"/>
    </SafeAreaView>
  )
}

export default RecipeList;