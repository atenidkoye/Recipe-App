import { useNavigation } from "@react-navigation/native"
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import staticStyles from "../static/styles";

const Navigation = ({activeTab}) => {
  const navigation = useNavigation();

  return (
    <View style={[staticStyles.centered, styles.container]}>
      {/* <Button title="Discover" onPress={() => navigation.navigate("Featured List")}/>
      <Button title="Search" onPress={() => navigation.navigate("Search")} />
      <Button title="List" onPress={() => navigation.navigate("Recipe List")}/>
      <Button title="Shopping" onPress={() => navigation.navigate("Shopping List")}/>
      <Button title="Account" onPress={() => navigation.navigate("Account")}/> */}

      <TouchableOpacity style={staticStyles.navItem} onPress={() => navigation.navigate("Featured List")}>
        <Text style={staticStyles.navText && staticStyles.activeNavText}>Discover</Text>
        {activeTab === "Recipe List" && <View style={staticStyles.activeIndicator}></View>}
      </TouchableOpacity>

      <TouchableOpacity style={staticStyles.navItem} onPress={() => navigation.navigate("Search")}>
        <Text style={staticStyles.navText && staticStyles.activeNavText}>Search</Text>
        {activeTab === "Search" && <View style={staticStyles.activeIndicator}></View>}
      </TouchableOpacity>

      <TouchableOpacity style={staticStyles.navItem} onPress={() => navigation.navigate("Recipe List")}>
        <Text style={staticStyles.navText && staticStyles.activeNavText}>List</Text>
        {activeTab === "Recipe List" && <View style={staticStyles.activeIndicator}></View>}
      </TouchableOpacity>

      <TouchableOpacity style={staticStyles.navItem} onPress={() => navigation.navigate("Shopping List")}>
        <Text style={staticStyles.navText && staticStyles.activeNavText}>Shopping List</Text>
        {activeTab === "Shopping List" && <View style={staticStyles.activeIndicator}></View>}
      </TouchableOpacity>

      <TouchableOpacity style={staticStyles.navItem} onPress={() => navigation.navigate("Account")}>
        <Text style={staticStyles.navText && staticStyles.activeNavText}>Account</Text>
        {activeTab === "Account" && <View style={staticStyles.activeIndicator}></View>}
      </TouchableOpacity>

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
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    height: '100%',
    position: 'relative'
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#6A569E',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    height: 3,
    backgroundColor: '#6A569E',
  }
})