import { View, Text } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";

const RecipeEditor = ({route}) => {

  const { recipe } = route.params;

  return (
    <View style={staticStyles.centered}>
      <Text>Recipe Editor</Text>
      <Text>{recipe ? "Editing" : "Adding"}</Text>
      <Navigation />
    </View>
  )
}

export default RecipeEditor;