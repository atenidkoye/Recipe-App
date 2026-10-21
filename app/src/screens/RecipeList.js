import { View, Text, TextInput, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from '../static/styles';
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useRef, useState } from "react";
import authContext from '../components/AuthContext';
import { fetchCategories, fetchRecipes, fetchUserRecipes } from "../utils/backendConn";
import { readUserRecipes } from '../utils/localDBConn';
import { useNavigation } from "@react-navigation/native";
import RecipeListItem from '../components/RecipeListItem';
import TextButton from "../components/TextButton";
import IconButton from "../components/IconButton";
import img from "../static/img";

const RecipeList = ({route}) => {
  const navigation = useNavigation();

  const { user } = useContext(authContext);
  const { isUserList } = route.params;

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryModalActive, setCategoryModalActive] = useState(false);
  
  const categorySorter = (a, b) => selectedCategories.includes(b) - selectedCategories.includes(a);

  const searchTimeout = useRef(null);
  const loadingTimeout = useRef(null);

  const selectCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories.filter(c => c != category)])
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const loadCategories = async () => {
    setCategories(await fetchCategories());
  }
  
  // Get recipe data
  useEffect(() => {
    loadCategories();

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
    searchTimeout.current = setTimeout(() => setSearchPhrase(phrase.toLowerCase()), 1500);
  }

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalActive}
      >
        <View style={staticStyles.modal}>
          <View style={staticStyles.popupView}>
            <IconButton
              icon={img.close}
              style={{position: "absolute", right: 0}}
              iconStyle={{width: 18, height: 18}}
              onPress={() => setCategoryModalActive(false)}
            />
            <View style={{flexDirection: "row", flexWrap: "wrap", gap: 20, margin: 30, justifyContent: "center"}}>
              {categories.sort(categorySorter).map((category, index) => <TextButton 
                key={index}
                buttonText={category.name}
                textStyle={{color: "black", fontSize: 14}}
                style={[staticStyles.categoryStyle, selectedCategories.includes(category) ? {backgroundColor: "#866EC0"} : null]}
                onPress={() => selectCategory(category)}
              />)}
            </View>
          </View>
        </View>
      </Modal>
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

        <View style={{flexDirection: "row", gap: 20, marginHorizontal: 10}}>
          {categories.sort(categorySorter).slice(0, 4).map((category, index) => <TextButton 
              key={index}
              buttonText={category.name}
              textStyle={{color: "black", fontSize: 14}}
              style={[staticStyles.categoryStyle, selectedCategories.includes(category) ? {backgroundColor: "#866EC0"} : null]}
              onPress={() => selectCategory(category)}
            />
          )}
          <TextButton 
            buttonText={"..."}
            textStyle={{color: "black", fontSize: 14}}
            style={staticStyles.categoryStyle}
            onPress={() => setCategoryModalActive(true)}
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
                <View>
                <Text style={{fontSize: 12, textAlign: 'center', color:'grey'}}>By swiping right you can mark recipe as favourite</Text>
                <Text style={{fontSize: 12, textAlign: 'center', color:'grey', marginBottom: 10}}>By swiping left you can edit recipe</Text>
                <FlatList
                  data={recipes.filter(
                    recipe => (
                      recipe.title.toLowerCase().includes(searchPhrase) || 
                      recipe.description.toLowerCase().includes(searchPhrase)
                    ) && (
                      selectedCategories.length == 0 || 
                      selectedCategories.some(category => recipe.categories.some(c => c.name == category.name))
                    )
                  )}
                  keyExtractor={(item) => item.id}
                  renderItem={(item) => <RecipeListItem item={item.item} isUserRecipe={isUserList} />}
                  />
                </View>
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