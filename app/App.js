import { NavigationContainer, useNavigation, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import AuthContext from './src/components/AuthContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RecipeList from './src/screens/RecipeList';
import Account from './src/screens/Account';
import ShoppingList from './src/screens/ShoppingList';
import Search from './src/screens/Search';

const Stack = createStackNavigator();

const App = () => {
  const navigation = useNavigationContainerRef();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (user) {
      navigation.navigate("Recipe List"); 
    } else {
      navigation.navigate("Login");
    }
  }, [user])

  return (
    <AuthContext value={{user, setUser}}>
      <NavigationContainer ref={navigation}>
        <Stack.Navigator initialRouteName='Login'>

          {/* Authorization screens */}
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />

          {/* App screens */}
          <Stack.Screen name="Recipe List" component={RecipeList} options={{headerShown: false}} />
          <Stack.Screen name="Featured List" component={RecipeList} options={{headerShown: false}} />
          <Stack.Screen name="Search" component={Search} options={{headerShown: false}} />
          <Stack.Screen name="Shopping List" component={ShoppingList} options={{headerShown: false}} />
          <Stack.Screen name="Account" component={Account} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext>
  );
}

export default App;
