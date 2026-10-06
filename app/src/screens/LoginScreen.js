import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import staticStyles from '../static/styles';
import AuthContext from "../components/AuthContext";
import { login } from "../utils/auth";

const LoginScreen = () => {
  const navigation = useNavigation();
  const {setUser} = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={[{flexDirection: "column", gap: 20}, staticStyles.centered]}>
      <Text>Login View</Text>

      <TextInput style={{borderWidth: 1, borderColor: "black", width: 200}} onChangeText={setEmail} />
      <TextInput style={{borderWidth: 1, borderColor: "black", width: 200}} onChangeText={setPassword} />
      <Button title="Login" onPress={() => login(email, password, setUser)}/>

      <Button title="I don't have an account" onPress={() => navigation.navigate("Register")} />
    </View>
  )
}

export default LoginScreen;