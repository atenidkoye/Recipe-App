
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useRef, useState } from "react";
import authContext from "../components/AuthContext";
import {
  fetchCategories,
  fetchRecipes,
  fetchUserRecipes,
} from "../utils/backendConn";
import { readUserRecipes } from "../utils/localDBConn";
import { useNavigation } from "@react-navigation/native";
import RecipeListItem from "../components/RecipeListItem";
import TextButton from "../components/TextButton";
import IconButton from "../components/IconButton";
import img from "../static/img";

const RecipeList = ({ route }) => {
  // Provides navigation methods for moving between screens.
  const navigation = useNavigation();

  // Gets the current user's authentication information.
  const { user } = useContext(authContext);

  // Determines whether to display the user's recipes or featured recipes.
  const { isUserList } = route.params;

  // Stores the recipes and controls the list's loading and empty states.
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  // Stores the search phrase entered by the user.
  const [searchPhrase, setSearchPhrase] = useState("");

  // Stores available categories and the categories selected for filtering.
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Controls the visibility of the category selection modal.
  const [categoryModalActive, setCategoryModalActive] = useState(false);

  // Moves selected categories to the beginning of the category list.
  const categorySorter = (a, b) =>
    selectedCategories.includes(b) - selectedCategories.includes(a);

  // Keeps references to timers used for search and loading.
  const searchTimeout = useRef(null);
  const loadingTimeout = useRef(null);

  // Adds a category to the filter or removes it if already selected.
  const selectCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories([
        ...selectedCategories.filter((c) => c != category),
      ]);
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Retrieves the available recipe categories.
  const loadCategories = async () => {
    setCategories(await fetchCategories());
  };

  // Loads categories and the appropriate recipe list when the screen mounts.
  useEffect(() => {
    loadCategories();

    if (!isUserList) {
      // Featured recipes are retrieved from the backend.
      fetchRecipes(setRecipes);
    } else {
      if (user.isGuest) {
        // Guest users retrieve their recipes from local storage.
        readUserRecipes(setRecipes);
      } else {
        // Logged-in users retrieve their recipes from the backend.
        fetchUserRecipes(user.token, setRecipes);
      }
    }
  }, []);

  // Updates the loading and empty states when the recipe list changes.
  useEffect(() => {
    // Show the loading indicator while the recipe list is empty.
    setLoading(recipes.length == 0);

    // Clear the previous timer before starting a new one.
    if (loadingTimeout.current) clearTimeout(loadingTimeout.current);

    if (recipes.length == 0) {
      // If no recipes appear after three seconds, show the empty state.
      loadingTimeout.current = setTimeout(() => {
        setIsEmpty(true);
        setLoading(false);
      }, 3000);
    }
  }, [recipes]);

  // Updates the search phrase after the user stops typing for 1.5 seconds.
  function updateSearchPhrase(phrase) {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(
      () => setSearchPhrase(phrase.toLowerCase()),
      1500
    );
  }

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      {/* Modal that allows users to select from all available categories. */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalActive}
      >
        <View style={staticStyles.modal}>
          <View style={staticStyles.popupView}>
            {/* Closes the category selection modal. */}
            <IconButton
              icon={img.close}
              style={{ position: "absolute", right: 0 }}
              iconStyle={{ width: 18, height: 18 }}
              onPress={() => setCategoryModalActive(false)}
            />

            {/* Displays category buttons and highlights selected categories. */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 20,
                margin: 30,
                justifyContent: "center",
              }}
            >
              {categories.sort(categorySorter).map((category, index) => (
                <TextButton
                  key={index}
                  buttonText={category.name}
                  textStyle={{ color: "black", fontSize: 14 }}
                  style={[
                    staticStyles.categoryStyle,
                    selectedCategories.includes(category)
                      ? { backgroundColor: "#866EC0" }
                      : null,
                  ]}
                  onPress={() => selectCategory(category)}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <View style={staticStyles.container}>
        {/* Changes the heading depending on the selected recipe list. */}
        <Text style={staticStyles.headerText}>
          {isUserList ? "My" : "Featured"} recipes
        </Text>

        {/* Search field for finding recipes by title or description. */}
        <View style={staticStyles.searchContainer}>
          <TextInput
            style={staticStyles.searchInput}
            placeholder="Search recipe"
            placeholderTextColor="black"
            onChangeText={updateSearchPhrase}
          />
          <Image
            source={require("../static/img/search.png")}
            style={staticStyles.searchIcon}
          />
        </View>

        {/* Displays up to four categories and a button for more categories. */}
        <View
          style={{
            flexDirection: "row",
            gap: 20,
            marginHorizontal: 10,
          }}
        >
          {categories
            .sort(categorySorter)
            .slice(0, 4)
            .map((category, index) => (
              <TextButton
                key={index}
                buttonText={category.name}
                textStyle={{ color: "black", fontSize: 14 }}
                style={[
                  staticStyles.categoryStyle,
                  selectedCategories.includes(category)
                    ? { backgroundColor: "#866EC0" }
                    : null,
                ]}
                onPress={() => selectCategory(category)}
              />
            ))}

          {/* Opens the modal to show all categories. */}
          <TextButton
            buttonText={"..."}
            textStyle={{ color: "black", fontSize: 14 }}
            style={staticStyles.categoryStyle}
            onPress={() => setCategoryModalActive(true)}
          />
        </View>

        {/* Main area containing the recipe list or its loading/empty state. */}
        <View style={staticStyles.mainContent}>
          <View style={staticStyles.listContainer}>
            {loading ? (
              // Displays a spinner while recipes are being loaded.
              <ActivityIndicator
                size="large"
                color="#6A569E"
                style={staticStyles.loader}
              />
            ) : isEmpty ? (
              // Displays a message and navigation option when the list is empty.
              <View style={[staticStyles.centered, { gap: 10 }]}>
                <Text style={{ fontSize: 16, textAlign: "center" }}>
                  {isUserList
                    ? "You don't have any recipes yet."
                    : "Sorry, something went wrong and we couldn't load public recipes."}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      isUserList ? "Add Recipe" : "Recipe List"
                    )
                  }
                >
                  <Text style={{ fontSize: 16, color: "blue" }}>
                    {isUserList ? "Add one" : "Browse your recipes"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {/* Explains the swipe actions available on recipe items. */}
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: "center",
                    color: "grey",
                  }}
                >
                  By swiping left you can set recipe as favourite
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    textAlign: "center",
                    color: "grey",
                    marginBottom: 10,
                  }}
                >
                  By swiping right you can edit recipe
                </Text>

                {/* Displays recipes matching the search and category filters. */}
                <FlatList
                  data={recipes.filter(
                    (recipe) =>
                      (
                        recipe.title.toLowerCase().includes(searchPhrase) ||
                        recipe.description
                          .toLowerCase()
                          .includes(searchPhrase)
                      ) &&
                      (selectedCategories.length == 0 ||
                        selectedCategories.some((category) =>
                          recipe.categories.some(
                            (c) => c.name == category.name
                          )
                        ))
                  )}
                  keyExtractor={(item) => item.id}
                  renderItem={(item) => <RecipeListItem item={item.item} />}
                />
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Shows the add-recipe button for the user's recipe list when available. */}
      {!isUserList || isEmpty || loading ? null : (
        <TextButton
          style={staticStyles.listAddButton}
          onPress={() => navigation.navigate("Add Recipe")}
          buttonText="Add Recipe"
          textStyle={{ fontSize: 16 }}
        />
      )}

      {/* Displays the main navigation and highlights the recipe list tab. */}
      <Navigation activeTab="Recipe List" />
    </SafeAreaView>
  );
};

export default RecipeList;
