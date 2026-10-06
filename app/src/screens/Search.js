import { View, Text } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";

const Search = () => {
  return (
    <View style={staticStyles.centered}>
      <Text>Search</Text>
      <Navigation activeTab="Search"/>
    </View>
  )
}

export default Search;