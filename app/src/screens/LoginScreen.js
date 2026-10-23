
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import staticStyles from "../static/styles";
import AuthContext from "../components/AuthContext";
import { continueAsGuest, login } from "../utils/auth";
import TextButton from "../components/TextButton";

const LoginScreen = () => {
  // Provides navigation to other screens, such as registration.
  const navigation = useNavigation();

  // Access the function that updates the current user
  // throughout the application.
  const { setUser } = useContext(AuthContext);

  // Store the email and password entered by the user.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        {/* Welcome heading displayed at the top of the screen. */}
        <Text style={staticStyles.headerText}>Welcome!</Text>

        <View style={staticStyles.form}>
          {/* Email input field. */}
          <Text style={staticStyles.label}>Email</Text>
          <TextInput
            style={staticStyles.input}
            placeholder="Email"
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password input field; entered characters are hidden. */}
          <Text style={staticStyles.label}>Password</Text>
          <TextInput
            style={staticStyles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          {/* Authenticate the user with the supplied credentials. */}
          <TextButton
            style={staticStyles.fullButton}
            buttonText="Login"
            onPress={() => login(email, password, setUser)}
          />
          <View style={[staticStyles.rowButtons, {marginTop: 20}]}>
            <TextButton style={staticStyles.halfButton} buttonText="Create account" onPress={() => navigation.navigate("Register")}/> 
            <TextButton style={staticStyles.halfButton} buttonText="Continue as Guest" onPress={() => continueAsGuest(setUser)} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
