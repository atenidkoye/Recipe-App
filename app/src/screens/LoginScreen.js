import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
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
    /*
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>Welcome!</Text>

        <View style={staticStyles.form}>
          <Text style={staticStyles.label}>Email</Text>
          <TextInput 
          style={staticStyles.input}
          placeholder="Email"
          />

          <Text style={staticStyles.label}>Password</Text>
          <TextInput 
          style={staticStyles.input}
          placeholder="Password"
          secureTextEntry={true}
          />

          <View style={staticStyles.rowButtons}>
            <TouchableOpacity style={staticStyles.halfButton} onPress={() => navigation.navigate("Recipe List")}>
              <Text style={staticStyles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={staticStyles.halfButton} onPress={() => navigation.navigate("Register")}>
              <Text style={staticStyles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={staticStyles.fullButton}>
            <Text style={staticStyles.buttonText}>Continue as Guest</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
    */
  )
}

export default LoginScreen;