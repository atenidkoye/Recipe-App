import { useNavigation } from "@react-navigation/native";
import { View, Text, Button } from "react-native";
import staticStyles from "../static/styles";


const RegisterScreen = () => {
	const navigation = useNavigation();
  
	return (
    <View style={[{flexDirection: "column", gap: 20}, staticStyles.centered]}>
      <Text>Register View</Text>
      <Button title="I already have an account" onPress={() => navigation.navigate("Login")} />
    </View>
  )
}

export default RegisterScreen;