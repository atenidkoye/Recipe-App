import { View, Text, Button } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";
import { useContext } from "react";
import AuthContext from "../components/AuthContext";
import { logout } from "../utils/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import TextButton from "../components/TextButton";

const Account = () => {
  const {user, setUser} = useContext(AuthContext);
  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>Account</Text>
          <View style={staticStyles.recipeCard}>
            <View style={staticStyles.recipeTextContainer}>
              <Text style={[staticStyles.name && {textAlign: 'center', fontSize: 25}]}>{user ? user.name : ''}</Text>
              <Text style={[staticStyles.description && {textAlign: 'center', paddingBottom: 20}]}>{user ? user.email : ''}</Text>
              <TextButton style={staticStyles.fullButton} buttonText="Log out" onPress={() => logout(setUser)}/>
            </View>
          </View>
      </View>
      <Navigation />
    </SafeAreaView>
  )
}

export default Account;