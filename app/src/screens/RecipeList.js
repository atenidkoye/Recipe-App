import { View, Text, TextInput, FlatList, ActivityIndicator, Image } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from '../static/styles';
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRecipes = async () => {
    try {
      const responce = await fetch('http://10.0.2.2:4000/api/recipes');
      const data = await responce.json();
      setRecipes(data);
      const dummyData = [
        {id: '1', category: 'Lorem ipsum', name: 'Salad', description: 'Lorem ipsum'},
        {id: '2', category: 'Lorem ipsum', name: 'Salad', description: 'Lorem ipsum'},
        {id: '3', category: 'Lorem ipsum', name: 'Salad', description: 'Lorem ipsum'},
        {id: '4', category: 'Lorem ipsum', name: 'Salad', description: 'Lorem ipsum'},
        {id: '5', category: 'Lorem ipsum', name: 'Salad', description: 'Lorem ipsum'},
        {id: '6', category: 'Lorem ipsum', name: 'Salad', description: 'Lorem ipsum'},
        {id: '7', category: 'Lorem ipsum', name: 'Salad', description: 'Lorem ipsum'},
        {id: '8', category: 'Lorem ipsum', name: 'Salad', description: 'Lorem ipsum'},
      ];

      // if no data to show, then dummy data
      setTimeout(() => {
        setRecipes(dummyData);
        setLoading(false);
      }, 3000);
    }
    catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    getRecipes();
  }, []);

  const renderRecipe = ({item}) => (
    <View style={staticStyles.recipeCard}>

      <View style={staticStyles.recipeTextContainer}>
        <Text style={staticStyles.category}>{item.category}</Text>
        <Text style={staticStyles.name}>{item.name}</Text>
        <Text style={staticStyles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    // <View style={staticStyles.centered}>
    //   <Text>Recipe List</Text>
    //   <Navigation />
    // </View>
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>Recipe Screen</Text>

        <View style={staticStyles.searchContainer}>
          <TextInput 
          style={staticStyles.searchInput}
          placeholder="Search recipe"
          placeholderTextColor="black"
          />
          <Image 
          source={require('../img/search.png')}
          style={staticStyles.searchIcon}
          />
        </View>

        <View style={staticStyles.mainContent}>
          <View style={staticStyles.listContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#6A569E" style={staticStyles.loader}/>
            ) : (
              <FlatList 
              data={recipes}
              keyExtractor={(item) => item.id}
              renderItem={renderRecipe}
              />
            )}
          </View>
        </View>
      </View>
    <Navigation activeTab="Recipe List"/>
    </SafeAreaView>
  )
}

export default RecipeList;