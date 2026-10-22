
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import staticStyles from "../static/styles";
import { useState, useContext } from "react";
import AuthContext from "../components/AuthContext";
import { register } from "../utils/auth";
import TextButton from "../components/TextButton";

const RegisterScreen = () => {
  // Provides navigation methods for moving between screens.
  const navigation = useNavigation();

  // Gets the function used to update the current user's authentication state.
  const { setUser } = useContext(AuthContext);

  // Stores the values entered into the registration form.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        {/* Displays the welcome heading. */}
        <Text style={staticStyles.headerText}>Welcome!</Text>

        <View style={staticStyles.form}>
          {/* Input field for the user's name. */}
          <Text style={staticStyles.label}>Name</Text>
          <TextInput
            style={staticStyles.input}
            placeholder="Name"
            onChangeText={setName}
          />

          {/* Input field for the user's email address. */}
          <Text style={staticStyles.label}>Email</Text>
          <TextInput
            style={staticStyles.input}
            placeholder="Email"
            onChangeText={setEmail}
          />

          {/* Password input hides the characters as they are entered. */}
          <Text style={staticStyles.label}>Password</Text>
          <TextInput
            style={staticStyles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          {/* Submits the form values to the registration function. */}
          <TextButton
            style={staticStyles.fullButton}
            buttonText="Register"
            onPress={() => register(name, email, password, setUser)}
          />

          {/* Navigates to the login screen for existing users. */}
          <TextButton
            style={[staticStyles.fullButton, { marginTop: 20 }]}
            buttonText="I already have an account"
            onPress={() => navigation.navigate("Login")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
