import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import staticStyles from '../static/styles';
import AuthContext from "../components/AuthContext";
import { continueAsGuest, login } from "../utils/auth";
import TextButton from "../components/TextButton";

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

          <TextButton style={staticStyles.fullButton} buttonText="Login" onPress={() => login(email, password, setUser)}/>

          <View style={[staticStyles.rowButtons, {marginTop: 20}]}>
            <TextButton style={staticStyles.halfButton} buttonText="Create account" onPress={() => navigation.navigate("Register")}/>
            <TextButton style={staticStyles.halfButton} buttonText="Continue as Guest" onPress={() => continueAsGuest(setUser)} />
          </View>

        </View>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen;