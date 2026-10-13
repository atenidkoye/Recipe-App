import { View, Text } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";

const Recipe = ({route}) => {

  const recipe = route.params.recipe;

  return (
    <View style={staticStyles.centered}>
      <Text>{recipe.title}</Text>
      <Navigation />
    </View>
  )
}

export default Recipe;