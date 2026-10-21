import { View, Text, Alert, FlatList, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from 'expo-checkbox';
import ShoppingListRow from "../components/ShoppingListRow";
import AuthContext from "../components/AuthContext";
import ShoppingItem from "../utils/types/shopping_list";

const ShoppingList = () => {
  const { user } = useContext(AuthContext);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listName, setListName] = useState('');
  const [items, setItems] = useState(['']);

  useEffect(() => {
    fetchItems();
  }, []);

  // fetching items from the REST API
  const fetchItems = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:4000/api/shopping-list`, {
        headers: {
          "authorization": `Bearer ${user.token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        groupItems(data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // groups items from REST API into structured lists (like 'Cake: Sugar' => Category: 'Cake', Item: 'Sugar')
  // as the backend hasn't field for the list title, the data is going as 'Cake: Sugar', 'Cake: Milk', and here it splits for the frontend
  const groupItems = (items) => {
    // takes elements from the array and flattens it
    const groups = items.reduce((list, item) => {
      let category = "Other";
      let itemName = item.name;

      // parses category and item name based on the delimiter ": "
      if (item.name.includes(": ")) {
        const parts = item.name.split(": ");
        category = parts[0];
        itemName = parts.slice(1).join(": ");
      }

      // finds an existing group or creates a new one
      let group = list.find(exGroup => exGroup.name === category);
      if (!group) {
        group = { id: category, name: category, items: []};
        list.push(group);
      }

      // pushes parsed item to its group
      group.items.push({
        id: item.id,
        text: itemName,
        checked: item.is_purchased === 1,
        originalItem: new ShoppingItem(item)
      });
      return list;
    }, []);
    setLists(groups);
  }

  // validates inputs and adds to shopping list
  const addShoppingList = async () => {
    if (!listName.trim()) {
      Alert.alert('Error!', 'Please specify the list name');
      return;
    }

    const validItems = items.filter(item => item.trim() !== '');
    if (validItems.length === 0) {
      Alert.alert('Error!', 'Please add at least one item');
      return;
    }

    setLoading(true);

    // creates api call for each valid item input
    for (const text of validItems) {
      const fullName = `${listName.trim()}: ${text.trim()}`;
      const newItem = new ShoppingItem({ name: fullName});
      await newItem.add.data(user.token);
    }

    await fetchItems();
    setListName('');
    setItems(['']);
  }

  // deletes the list and all items
  const deleteList = async (deleteId) => {
    const group = lists.find(exGroup => exGroup.id === deleteId);
    if (group) {
      setLoading(true);
      for (const item of group.items) {
        await item.originalItem.delete.data(user.token);
      }
      await fetchItems();
    }
  }

  // updates title (category)
  const editListTitle = async (oldTitle, newTitle) => {
    // using optimistic UI update: it would instantly change the UI without waiting for the server
    setLists(lists => lists.map(list => list.id === oldTitle ? {
      ...list,
      name: newTitle
    } : list
    ));

    const group = lists.find(exGroup => exGroup.id === oldTitle);
    if (group) {
      // sends individual update requests for each item to change their "category" prefix
      for (const item of group.items) {
        const fullName = `${newTitle}: ${item.text}`;
        await item.originalItem.edit.data(user.token, { name: fullName});
      }
    }
  }

  // editing single item
  const editListItem = async (apiItemId, newText, listTitle) => {
    // optimistuc UI update
    setLists(lists => lists.map(list => {
      const newItems = list.items.map(item => item.id === apiItemId ? {
        ...item,
        text: newText,
      } : item);
      return {...list, items: newItems};
    }));

    const fullName = `${listTitle}: ${newText}`;
    for (const list of lists) {
      const item = list.items.find(_item => _item.id === apiItemId);
      if (item) {
        await item.originalItem.edit.data(user.token, {name: fullName});
        break;
      }
    }
  }

  // toggles the checkboxes (is purchased)
  const toggleItem = async (apiItemId, currentChecked) => {
    // optimistic UI update
    setLists(lists => lists.map(list => {
      const newItems = list.items.map(item => item.id === apiItemId ? {...item, checked: !currentChecked} : item);
      return {...list, items: newItems};
    }));

    // finds the item and updates its status on the backend
    for (const list of lists) {
      const item = list.items.find(_item => _item.id === apiItemId);
      if (item) {
        await item.originalItem.edit.data(user.token, {is_purchased: currentChecked ? 0 : 1});
        break;
      }
    }
  }

  // updates the value of a specific input field 
  const handleItemChange = (text, index) => {
    const newItems = [...items];
    newItems[index] = text;
    setItems(newItems);
  }

  // appends an empty input field
  const addInput = () => {
    setItems([...items, '']);
  }


  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.shoppingContainer}>
        {loading ? (
          <ActivityIndicator size='large' color='#6A569E' style={{marginTop: 50}}/>
        ) : (
          <FlatList
          style={staticStyles.listsContainer}
          data={lists}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ShoppingListRow list={item} onDelete={deleteList} toggleItem={toggleItem} onEditItem={editListItem} onEditTitle={editListTitle}/>
          )}
          />
        )}
        <View style={staticStyles.listForm}>
          <Text style={{fontSize: 12, color: 'grey', marginBottom: 10, textAlign: "center"}}>By clicking on a text you can edit title or items</Text>
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
              placeholder={`Item #${index + 1}`}
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