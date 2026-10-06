import { useNavigation } from "@react-navigation/native";
import { View, Text, Button, TextInput } from "react-native";
import staticStyles from "../static/styles";
import { useState, useContext } from "react";
import AuthContext from "../components/AuthContext";
import { register } from "../utils/auth";

const RegisterScreen = () => {
	const navigation = useNavigation();
  
	const {setUser} = useContext(AuthContext);
	
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

	return (
    <View style={[{flexDirection: "column", gap: 20}, staticStyles.centered]}>
      <Text>Register View</Text>

			<TextInput style={{borderWidth: 1, borderColor: "black", width: 200}} onChangeText={setName} />
			<TextInput style={{borderWidth: 1, borderColor: "black", width: 200}} onChangeText={setEmail} />
			<TextInput style={{borderWidth: 1, borderColor: "black", width: 200}} onChangeText={setPassword} />
			<Button title="Register" onPress={() => register(name, email, password, setUser)}/>

      <Button title="I already have an account" onPress={() => navigation.navigate("Login")} />
    </View>
  )
}

export default RegisterScreen;