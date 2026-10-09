// React
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';

// Auth management
import User from './src/utils/types/user';
import AuthContext from './src/components/AuthContext';
import { getUserData } from './src/utils/db';
import { isTokenValid } from './src/utils/auth';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RecipeList from './src/screens/RecipeList';
import Account from './src/screens/Account';
import ShoppingList from './src/screens/ShoppingList';
import Search from './src/screens/Search';
import Recipe from './src/screens/Recipe';
import RecipeEditor from './src/screens/RecipeEditor';

const Stack = createStackNavigator();

const App = () => {
  const navigation = useNavigationContainerRef();

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to get user data from local storage
    // TODO: add a loading screen while fetching data
    // TODO: check wheter the token is still valid
    getUserData().then(async (userData) => {
      if (userData && !user) {
        if (await isTokenValid(userData.token)) { // Only log in user if the token is still valid
          setUser(new User(User.NOT_GUEST, userData.id, userData.name, userData.email, userData.token));
        }
      }
    });

    // After user changes (login, register, logout, continue as guest, data from local storage) change screen
    if (!user) {
      navigation.navigate("Login");
    } else {
      navigation.navigate("Recipe List"); 
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

          {/* Sub screens */}
          <Stack.Screen name="Recipe" component={Recipe} options={{headerShown: false}} />
          <Stack.Screen name="Add Recipe" component={RecipeEditor} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext>
  );
}

export default App;
