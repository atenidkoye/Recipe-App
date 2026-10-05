import { useNavigation } from "@react-navigation/native";
import { View, Text, Button, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import staticStyles from '../static/styles';

const LoginScreen = () => {
  const navigation = useNavigation();
  
  return (
    // <View style={[{flexDirection: "column", gap: 20}, staticStyles.centered]}>
    //   <Text>Login View</Text>
    //   <Button title="I don't have an account" onPress={() => navigation.navigate("Register")} />
    // </View>
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
            <TouchableOpacity style={staticStyles.halfButton}>
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
  )
}

export default LoginScreen;