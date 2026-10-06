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
    // <View style={[{flexDirection: "column", gap: 20}, staticStyles.centered]}>
    //   <Text>Register View</Text>

		// 	<TextInput style={{borderWidth: 1, borderColor: "black", width: 200}} onChangeText={setName} />
		// 	<TextInput style={{borderWidth: 1, borderColor: "black", width: 200}} onChangeText={setEmail} />
		// 	<TextInput style={{borderWidth: 1, borderColor: "black", width: 200}} onChangeText={setPassword} />
		// 	<Button title="Register" onPress={() => register(name, email, password, setUser)}/>

    //   <Button title="I already have an account" onPress={() => navigation.navigate("Login")} />
    // </View>

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

          {/* <View style={staticStyles.rowButtons}>
            <TouchableOpacity style={staticStyles.halfButton} onPress={() => login(email, password, setUser)}>
              <Text style={staticStyles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={staticStyles.halfButton} onPress={() => navigation.navigate("Register")}>
              <Text style={staticStyles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View> */}

          <TouchableOpacity style={staticStyles.fullButton} onPress={() => register(name, email, password, setUser)}>
            <Text style={staticStyles.buttonText}>Register</Text>
          </TouchableOpacity>
          <Text style={staticStyles.label2 && {textAlign: 'center'}}>I already have an account</Text>

          <View style={staticStyles.rowButtons2}>
            <TouchableOpacity style={staticStyles.halfButton} onPress={() => navigation.navigate("Login")}>
              <Text style={staticStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </SafeAreaView>
  )
}

export default RegisterScreen;