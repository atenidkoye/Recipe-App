import { View, Text } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";

const ShoppingList = () => {
  return (
    <View style={staticStyles.centered}>
      <Text>Shopping List</Text>
      <Navigation />
    </View>
  )
}

export default ShoppingList;