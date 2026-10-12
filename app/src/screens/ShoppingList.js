import { View, Text, Alert, FlatList, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: delete by swipe

const ShoppingList = () => {
  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState('');
  const [items, setItems] = useState(['']);
  const [id, setId] = useState(1);

  const handleItemChange = (text, index) => {
    const newItems = [...items];
    newItems[index] = text;
    setItems(newItems);
  }

  const addInput = () => {
    setItems([...items, '']);
  }

  const addShoppingList = () => {
    if (!listName.trim()) {
      Alert.alert('Error!', 'Please specify the list name');
      return;
    }

    const validItems = items.filter(item => item.trim() !== '');
    if (validItems.length === 0) {
      Alert.alert('Error!', 'Please add at least one item');
      return;
    }

    const newList = {
      id: id,
      name: listName,
      items: validItems
    }

    setLists([newList, ...lists]);

    setListName('');
    setItems(['']);
    setId(id => id + 1);
  }
  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.shoppingContainer}>
        <FlatList
        style={staticStyles.listsContainer}
        data={lists}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={staticStyles.listItem}>
            <Text>{item.name}: {item.items.join(', ')}</Text>
          </View>
        )}
        />
        <View style={staticStyles.listForm}>
          <TextInput
          style={staticStyles.shopInput}
          placeholder="List Name"
          value={listName}
          onChangeText={setListName}
          />

          <ScrollView style={staticStyles.shopScroll} nestedScrollEnabled>
            {items.map((item, index) => (
              <TextInput
              key={index}
              style={staticStyles.shopInput}
              placeholder={`Element #${index + 1}`}
              value={item}
              onChangeText={(text) => handleItemChange(text, index)}
              />
            ))} 

            <TouchableOpacity style={staticStyles.addMore} onPress={addInput}>
              <Text style={staticStyles.addMoreText}>+</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity style={staticStyles.addButton} onPress={addShoppingList}>
            <Text style={staticStyles.addButtonText}>Save List</Text>
          </TouchableOpacity>
        </View>

      </View>
      <Navigation activeTab="Shopping List"/>
    </SafeAreaView>
  )
}

export default ShoppingList;