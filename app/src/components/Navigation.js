import { useNavigation } from "@react-navigation/native"
import { Button, StyleSheet } from "react-native";
import { View } from "react-native";
import staticStyles from "../static/styles";

const Navigation = () => {
  const navigation = useNavigation();

  return (
    <View style={[staticStyles.centered, styles.container]}>
      <Button title="Discover" onPress={() => navigation.navigate("Featured List")}/>
      <Button title="Search" onPress={() => navigation.navigate("Search")} />
      <Button title="List" onPress={() => navigation.navigate("Recipe List")}/>
      <Button title="Shopping" onPress={() => navigation.navigate("Shopping List")}/>
      <Button title="Account" onPress={() => navigation.navigate("Account")}/>
    </View>
  )
}

export default Navigation;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "space-evenly",
    bottom: 0,
    height: 100,
    backgroundColor: "#dfdfdf",
    flexDirection: "row"
  }
})