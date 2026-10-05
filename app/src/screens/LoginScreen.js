import { useNavigation } from "@react-navigation/native";
import { View, Text, Button } from "react-native";
import staticStyles from '../static/styles';

const LoginScreen = () => {
  const navigation = useNavigation();
  
  return (
    <View style={[{flexDirection: "column", gap: 20}, staticStyles.centered]}>
      <Text>Login View</Text>
      <Button title="I don't have an account" onPress={() => navigation.navigate("Register")} />
    </View>
  )
}

export default LoginScreen;