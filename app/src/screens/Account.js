import { View, Text } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";

const Account = () => {
  return (
    <View style={staticStyles.centered}>
      <Text>Account</Text>
      <Navigation />
    </View>
  )
}

export default Account;