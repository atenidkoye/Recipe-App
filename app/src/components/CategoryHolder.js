import { View, Text } from "react-native";
import staticStyles from "../static/styles";
import TextButton from "./TextButton";

const CategoryHolder = ({active, categories, changeFunction}) => {
  return (
    <View style={{flexDirection: "column", alignItems: "center"}}>
      <Text style={staticStyles.label}>{active ? "Selected" : "Available"}</Text>
      <View style={{flexDirection: "row", justifyContent: "center", gap: 10, backgroundColor: "white", borderRadius: 10, width: 150, height: 150, padding: 7, flexWrap: "wrap"}}>
        {categories.map((category, index) => <TextButton 
          buttonText={category.name}
          key={index}
          textStyle={{color: "black"}}
          onPress={() => changeFunction(!active, category)}
        />)}
      </View>
    </View>
  )
}

export default CategoryHolder;