import { View, Text, Button } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";
import { useContext } from "react";
import AuthContext from "../components/AuthContext";
import { logout } from "../utils/auth";

const Account = () => {
  const {user, setUser} = useContext(AuthContext);
  return (
    <View style={staticStyles.centered}>
      <Text>{user ? user.name : ""}</Text>
      <Button title="Log out" onPress={() => logout(setUser)}/>
      <Navigation />
    </View>
  )
}

export default Account;