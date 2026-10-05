import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RecipeList from './src/screens/RecipeList';
import Account from './src/screens/Account';
import ShoppingList from './src/screens/ShoppingList';
import Search from './src/screens/Search';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>

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
  );
}

export default App;
