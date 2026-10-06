import { View, Text } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";

const RecipeEditor = () => {
  return (
    <View style={staticStyles.centered}>
      <Text>Recipe Editor</Text>
      <Navigation />
    </View>
  )
}

export default RecipeEditor;