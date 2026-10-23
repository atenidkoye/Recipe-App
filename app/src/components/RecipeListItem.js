import { useNavigation } from '@react-navigation/native';
import { useContext, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, TouchableOpacity, View, Text, Image } from 'react-native';
import staticStyles from '../static/styles';
import AuthContext from './AuthContext';
import Recipe from '../utils/types/recipe';
import { toggleLocalFavourite } from '../utils/localDBConn';

const RecipeListItem = ({item, isUserRecipe}) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [recipe, setRecipe] = useState(item);
  const [actionColour, setActionColour] = useState("transparent");

  // getting recipe data. If this is an object from sqlite, the it will take it, if it's class - then calls recipe.getData()
  const getRecipeData = () => {
    return typeof recipe.getData === 'function' ? recipe.getData() : recipe;
  }

  // For swiping actions (edit, favourite)
  const pan = useRef(new Animated.ValueXY).current;
  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    
    // Swipping action
    onPanResponderMove: (_, gesture) => {
      if (!isUserRecipe) {
        return;
      }

      pan.x.setValue(gesture.dx);
      if (pan.x._value < -10) { // Swipping left -> edit recipe
        setActionColour("#FF8000A0");
      } if (pan.x._value > 10) { // Swipping right -> mark/unmark recipe as favourite
        setActionColour("#FFFF00A0");
      } if (Math.abs(pan.x._value) <= 10) { // In the middle -> no action
        setActionColour("transparent");
      }
    },

    // Swiping finished
    onPanResponderRelease: async () => {
      if (pan.x._value < -90) { // Left -> edit recipe
        navigation.navigate("Edit Recipe", {recipe: getRecipeData()});
      } else if (pan.x._value > 90) { // Right -> mark/unmark recipe as favourite
        let newFavStatus;

        // dividing logic for guest user and logged in user
        if (user.isGuest) {
          newFavStatus = await toggleLocalFavourite(user.id || 0, recipe.id, recipe.isFavourite);
        } else {
          let updatedRecipe = new Recipe({...recipe});
          updatedRecipe.isFavourite = recipe.isFavourite;
          newFavStatus = await updatedRecipe.edit.isFavourite(user.token);
        }
        setRecipe(current => ({...current, isFavourite: newFavStatus}));
      }
      
      // Refresh element
      pan.setValue({x: 0, y: 0});
      setActionColour("transparent");
      pan.extractOffset()
    }
  }), [recipe]);

  return (
    <View>
      <View style={[staticStyles.recipeBackground, {backgroundColor: actionColour, flexDirection: actionColour == "#FFFF00A0" ? "row" : "row-reverse"}]}>
        {actionColour == "#FFFF00A0" ? <Image style={{transform: [{scale: 0.33}]}} source={require('../static/img/favourite.png')}></Image> : null}
        {actionColour == "#FF8000A0" ? <Image style={{transform: [{scale: 0.33}]}} source={require('../static/img/edit.png')}></Image> : null}
      </View>
      <Animated.View
        style={{transform: [{translateX: pan.x}, {translateY: 0}]}}
        {...panResponder.panHandlers}
        >
        <TouchableOpacity style={staticStyles.recipeCard} onPress={() => navigation.navigate("Recipe", {recipe: getRecipeData()})}>
          <Text style={{position: "absolute", top: 5, right: 10, fontSize: 24, color: "#bb6400a0", fontWeight: "bold"}}>{recipe.isFavourite ? "★" : ""}</Text>
          <View style={staticStyles.recipeTextContainer}>
            <Text style={staticStyles.category}>{recipe.categories.map(category => category.name + " ")}</Text>
            <Text style={staticStyles.name}>{recipe.title}</Text>
            <Text style={staticStyles.description}>{recipe.description}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default RecipeListItem;