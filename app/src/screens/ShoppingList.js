
import {
  View,
  Text,
  Alert,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ShoppingListRow from "../components/ShoppingListRow";
import AuthContext from "../components/AuthContext";
import ShoppingItem from "../utils/types/shopping_list";

import {
  getDatabase,
  getOrCreateShoppingList,
  getShoppingListItems,
  addShoppingListItem,
  setShoppingItemPurchased,
  deleteShoppingListItem,
} from "../database/database";

const ShoppingList = () => {
  // Gets the current user's authentication and guest status.
  const { user } = useContext(AuthContext);

  // Stores shopping lists, loading status, and new list form values.
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listName, setListName] = useState("");
  const [items, setItems] = useState([""]);

  // Reloads shopping lists when the user's authentication details change.
  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user?.id, user?.isGuest, user?.token]);

  // Retrieves shopping items from SQLite for guests or the backend for logged-in users.
  const fetchItems = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      if (user.isGuest) {
        // Gets the guest's local shopping list and its saved items.
        const shoppingListId = await getOrCreateShoppingList(user.id);
        const data = await getShoppingListItems(shoppingListId);

        // Groups locally stored items using the list name before ": ".
        const groups = data.reduce((result, item) => {
          const separator = item.name.indexOf(": ");
          const category =
            separator >= 0 ? item.name.slice(0, separator) : "Other";
          const itemName =
            separator >= 0 ? item.name.slice(separator + 2) : item.name;

          // Finds the existing group or creates a new one.
          let group = result.find((entry) => entry.name === category);

          if (!group) {
            group = {
              id: category,
              name: category,
              items: [],
            };
            result.push(group);
          }

          // Adds the item and its purchased status to the group.
          group.items.push({
            id: item.id,
            text: itemName,
            checked: item.is_purchased === 1,
          });

          return result;
        }, []);

        setLists(groups);
      } else {
        // Requests the logged-in user's shopping items from the backend.
        const response = await fetch(
          "http://10.0.2.2:4000/api/shopping-list",
          {
            headers: {
              authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await response.json();

        // Throws an error if the backend request was unsuccessful.
        if (!response.ok) {
          throw new Error(data.message || "Could not load shopping list.");
        }

        // Organizes the returned items into named shopping lists.
        groupItems(data.data);
      }
    } catch (error) {
      // Logs loading errors and informs the user.
      console.error("Failed to fetch shopping list:", error);
      Alert.alert("Error", "Could not load your shopping list.");
    } finally {
      // Stops the loading indicator after the request finishes.
      setLoading(false);
    }
  };

  // Groups backend shopping items by the list name stored in each item.
  const groupItems = (data) => {
    const groups = data.reduce((result, item) => {
      let category = "Other";
      let itemName = item.name;

      // Separates the list title from the item name.
      if (item.name.includes(": ")) {
        const parts = item.name.split(": ");
        category = parts[0];
        itemName = parts.slice(1).join(": ");
      }

      // Finds the corresponding list or creates a new group.
      let group = result.find((entry) => entry.name === category);

      if (!group) {
        group = { id: category, name: category, items: [] };
        result.push(group);
      }

      // Stores the item details and its model for backend operations.
      group.items.push({
        id: item.id,
        text: itemName,
        checked: item.is_purchased === 1,
        originalItem: new ShoppingItem(item),
      });

      return result;
    }, []);

    setLists(groups);
  };

  // Validates and saves a new shopping list and its items.
  const addShoppingList = async () => {
    if (!listName.trim()) {
      Alert.alert("Error", "Please specify the list name.");
      return;
    }

    // Ignores blank item fields.
    const validItems = items.filter((item) => item.trim() !== "");

    if (validItems.length === 0) {
      Alert.alert("Error", "Please add at least one item.");
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      if (user.isGuest) {
        // Saves each item to the guest's local SQLite shopping list.
        const shoppingListId = await getOrCreateShoppingList(user.id);

        for (const text of validItems) {
          await addShoppingListItem(
            shoppingListId,
            `${listName.trim()}: ${text.trim()}`
          );
        }
      } else {
        // Saves each item through the backend for logged-in users.
        for (const text of validItems) {
          const newItem = new ShoppingItem({
            name: `${listName.trim()}: ${text.trim()}`,
          });

          const success = await newItem.add.data(user.token);

          if (!success) {
            throw new Error("Could not save a shopping-list item.");
          }
        }
      }

      // Resets the form and refreshes the displayed lists.
      setListName("");
      setItems([""]);
      await fetchItems();
    } catch (error) {
      // Handles errors that occur while saving the list.
      console.error("Failed to save shopping list:", error);
      Alert.alert("Error", "Could not save your shopping list.");
      setLoading(false);
    }
  };

  // Deletes all items belonging to the selected shopping list.
  const deleteList = async (deleteId) => {
    const group = lists.find((entry) => entry.id === deleteId);
    if (!group || !user) return;

    setLoading(true);

    try {
      if (user.isGuest) {
        // Removes each item in the group from the local database.
        for (const item of group.items) {
          await deleteShoppingListItem(item.id);
        }
      } else {
        // Deletes each item through the backend for logged-in users.
        for (const item of group.items) {
          await item.originalItem.delete.data(user.token);
        }
      }

      // Reloads the lists after deletion.
      await fetchItems();
    } catch (error) {
      console.error("Failed to delete shopping list:", error);
      Alert.alert("Error", "Could not delete the shopping list.");
      setLoading(false);
    }
  };

  // Renames a shopping list and updates the stored names of its items.
  const editListTitle = async (oldTitle, newTitle) => {
    // Updates the displayed title immediately.
    setLists((current) =>
      current.map((list) =>
        list.id === oldTitle ? { ...list, name: newTitle } : list
      )
    );

    if (!user || !newTitle.trim()) return;

    const group = lists.find((entry) => entry.id === oldTitle);
    if (!group) return;

    try {
      if (user.isGuest) {
        // Updates each item's name directly in SQLite.
        const db = await getDatabase();

        for (const item of group.items) {
          await db.runAsync(
            "UPDATE shopping_list_items SET name = ? WHERE id = ?",
            `${newTitle.trim()}: ${item.text}`,
            item.id
          );
        }
      } else {
        // Updates each item's name through the backend.
        for (const item of group.items) {
          await item.originalItem.edit.data(user.token, {
            name: `${newTitle.trim()}: ${item.text}`,
          });
        }
      }

      // Reloads the lists to reflect the saved title.
      await fetchItems();
    } catch (error) {
      console.error("Failed to rename shopping list:", error);
      Alert.alert("Error", "Could not rename the shopping list.");
      await fetchItems();
    }
  };

  // Updates an item's text and saves the change to the appropriate storage.
  const editListItem = async (itemId, newText, listTitle) => {
    // Updates the displayed item text immediately.
    setLists((current) =>
      current.map((list) => ({
        ...list,
        items: list.items.map((item) =>
          item.id === itemId ? { ...item, text: newText } : item
        ),
      }))
    );

    if (!user || !newText.trim()) return;

    try {
      if (user.isGuest) {
        // Updates the item's stored name in SQLite.
        const db = await getDatabase();

        await db.runAsync(
          "UPDATE shopping_list_items SET name = ? WHERE id = ?",
          `${listTitle}: ${newText.trim()}`,
          itemId
        );
      } else {
        // Finds the item and updates it through the backend.
        for (const list of lists) {
          const item = list.items.find((entry) => entry.id === itemId);

          if (item) {
            await item.originalItem.edit.data(user.token, {
              name: `${listTitle}: ${newText.trim()}`,
            });
            break;
          }
        }
      }
    } catch (error) {
      console.error("Failed to edit shopping item:", error);
      Alert.alert("Error", "Could not edit the item.");
      await fetchItems();
    }
  };

  // Toggles an item's purchased status and persists the change.
  const toggleItem = async (itemId, currentChecked) => {
    // Updates the checkbox immediately for a responsive interface.
    setLists((current) =>
      current.map((list) => ({
        ...list,
        items: list.items.map((item) =>
          item.id === itemId
            ? { ...item, checked: !currentChecked }
            : item
        ),
      }))
    );

    if (!user) return;

    try {
      if (user.isGuest) {
        // Saves the new purchased status in the local database.
        await setShoppingItemPurchased(itemId, !currentChecked);
      } else {
        // Finds the item and saves its new status through the backend.
        for (const list of lists) {
          const item = list.items.find((entry) => entry.id === itemId);

          if (item) {
            await item.originalItem.edit.data(user.token, {
              is_purchased: currentChecked ? 0 : 1,
            });
            break;
          }
        }
      }
    } catch (error) {
      // Reloads the lists if the update fails.
      console.error("Failed to update shopping item:", error);
      Alert.alert("Error", "Could not update the item.");
      await fetchItems();
    }
  };

  // Updates the text in a new-item input field.
  const handleItemChange = (text, index) => {
    const updatedItems = [...items];
    updatedItems[index] = text;
    setItems(updatedItems);
  };

  // Adds another empty input field for a shopping-list item.
  const addInput = () => {
    setItems((current) => [...current, ""]);
  };

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.shoppingContainer}>
        {loading ? (
          // Shows a loading indicator while shopping lists are retrieved.
          <ActivityIndicator
            size="large"
            color="#6A569E"
            style={{ marginTop: 50 }}
          />
        ) : (
          // Displays the shopping lists and connects their row actions.
          <FlatList
            style={staticStyles.listsContainer}
            data={lists}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ShoppingListRow
                list={item}
                onDelete={deleteList}
                toggleItem={toggleItem}
                onEditItem={editListItem}
                onEditTitle={editListTitle}
              />
            )}
          />
        )}

        {/* Form for creating a new shopping list. */}
        <View style={staticStyles.listForm}>
          <Text
            style={{
              fontSize: 12,
              color: "grey",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Tap text to edit list titles or items.
          </Text>

          {/* Input for the new shopping-list title. */}
          <TextInput
            style={staticStyles.shopInput}
            placeholder="List Name"
            value={listName}
            onChangeText={setListName}
          />

          {/* Displays an input field for each new item. */}
          <ScrollView
            style={staticStyles.shopScroll}
            nestedScrollEnabled
          >
            {items.map((item, index) => (
              <TextInput
                key={index}
                style={staticStyles.shopInput}
                placeholder={`Item #${index + 1}`}
                value={item}
                onChangeText={(text) => handleItemChange(text, index)}
              />
            ))}

            {/* Adds another item input field. */}
            <TouchableOpacity
              style={staticStyles.addMore}
              onPress={addInput}
            >
              <Text style={staticStyles.addMoreText}>+</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Saves the new shopping list. */}
          <TouchableOpacity
            style={staticStyles.addButton}
            onPress={addShoppingList}
          >
            <Text style={staticStyles.addButtonText}>Save List</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Displays the main navigation with the shopping-list tab active. */}
      <Navigation activeTab="Shopping List" />
    </SafeAreaView>
  );
};

export default ShoppingList;
