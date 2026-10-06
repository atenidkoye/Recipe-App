import { useNavigation } from "@react-navigation/native";
import { View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>Welcome!</Text>

        <View style={staticStyles.form}>
          <Text style={staticStyles.label}>Name</Text>
          <TextInput 
            style={staticStyles.input}
            placeholder="Name"
            onChangeText={setName}
          />

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

          <TouchableOpacity style={staticStyles.fullButton} onPress={() => register(name, email, password, setUser)}>
            <Text style={staticStyles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[staticStyles.fullButton, {marginTop: 20}]} onPress={() => navigation.navigate("Login")}>
            <Text style={staticStyles.buttonText}>I already have an account</Text>
          </TouchableOpacity>
        
        </View>
      </View>
    </SafeAreaView>
  )
}

export default RegisterScreen;