import { View, Text } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from '../static/styles';

const RecipeList = () => {
  return (
    <View style={staticStyles.centered}>
      <Text>Recipe List</Text>
      <Navigation />
    </View>
  )
}

export default RecipeList;