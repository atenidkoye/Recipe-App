import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import staticStyles from '../static/styles';
import AuthContext from "../components/AuthContext";
import { continueAsGuest, login } from "../utils/auth";

const LoginScreen = () => {
  const navigation = useNavigation();
  const {setUser} = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>Welcome!</Text>

        <View style={staticStyles.form}>
          <Text style={staticStyles.label}>Email</Text>
          <TextInput 
            style={staticStyles.input}
            placeholder="Email"
            onChangeText={setEmail}
          />

          <Text style={staticStyles.label}>Password</Text>
          <TextInput 
            style={staticStyles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={staticStyles.fullButton} onPress={() => login(email, password, setUser)}>
            <Text style={staticStyles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={[staticStyles.rowButtons, {marginTop: 20}]}>
            <TouchableOpacity style={staticStyles.halfButton} onPress={() => navigation.navigate("Register")}>
              <Text style={staticStyles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity style={staticStyles.halfButton} onPress={() => continueAsGuest(setUser)}>
              <Text style={staticStyles.buttonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen;