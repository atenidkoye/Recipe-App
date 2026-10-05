import { View, Text } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";

const Recipe = () => {
  return (
    <View style={staticStyles.centered}>
      <Text>Recipe</Text>
      <Navigation />
    </View>
  )
}

export default Recipe;