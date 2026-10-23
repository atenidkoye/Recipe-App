import { useNavigation, useRoute } from "@react-navigation/native"
import { View, StyleSheet } from "react-native";
import staticStyles from "../static/styles";
import IconButton from './IconButton';
import img from '../static/img';

const Navigation = ({activeTab}) => {
  let route = useRoute();
  const navigation = useNavigation();
  
  return (
    <View style={[staticStyles.centered, styles.container]}>
      <IconButton style={route.name == "Featured List" ? staticStyles.activeIndicator : null} icon={img.feature} onPress={() => navigation.navigate("Featured List")} />
      <IconButton style={route.name == "Add Recipe" ? staticStyles.activeIndicator : null} icon={img.add} onPress={() => navigation.navigate("Add Recipe")} />
      <IconButton style={route.name == "Recipe List" ? staticStyles.activeIndicator : null} icon={img.recipe} onPress={() => navigation.navigate("Recipe List")} />
      <IconButton style={route.name == "Shopping List" ? staticStyles.activeIndicator : null} icon={img.cart} onPress={() => navigation.navigate("Shopping List")} />
      <IconButton style={route.name == "Account" ? staticStyles.activeIndicator : null} icon={img.account} onPress={() => navigation.navigate("Account")} />
    </View>
  )
}

export default Navigation;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "space-evenly",
    bottom: 0,
    width: '100%',
    height: 75,
    backgroundColor: "#FAEDFF",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#FAEDFF",
    paddingBottom: 15,
  }
})