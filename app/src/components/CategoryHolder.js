import { View, ScrollView, Text } from "react-native";
import staticStyles from "../static/styles";
import TextButton from "./TextButton";

const CategoryHolder = ({active, categories, changeFunction}) => {
  return (
    <View style={{flexDirection: "column", alignItems: "center"}}>
      <Text style={staticStyles.label}>{active ? "Selected" : "Available"}</Text>
      <ScrollView contentContainerStyle={staticStyles.categoryHolder}>
        {categories.map((category, index) => <TextButton 
          buttonText={category.name}
          key={index}
          textStyle={{color: "black", fontSize: 14}}
          style={staticStyles.categoryStyle}
          onPress={() => changeFunction(!active, category)}
        />)}
      </ScrollView>
    </View>
  )
}

export default CategoryHolder;