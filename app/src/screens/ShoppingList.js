
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
  const { user } = useContext(AuthContext);

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listName, setListName] = useState("");
  const [items, setItems] = useState([""]);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user?.id, user?.isGuest, user?.token]);

  const fetchItems = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      if (user.isGuest) {
        const shoppingListId = await getOrCreateShoppingList(user.id);
        const data = await getShoppingListItems(shoppingListId);

        // Group locally stored items by the list name before ": ".
        const groups = data.reduce((result, item) => {
          const separator = item.name.indexOf(": ");
          const category =
            separator >= 0 ? item.name.slice(0, separator) : "Other";
          const itemName =
            separator >= 0 ? item.name.slice(separator + 2) : item.name;

          let group = result.find((entry) => entry.name === category);

          if (!group) {
            group = {
              id: category,
              name: category,
              items: [],
            };
            result.push(group);
          }

          group.items.push({
            id: item.id,
            text: itemName,
            checked: item.is_purchased === 1,
          });

          return result;
        }, []);

        setLists(groups);
      } else {
        const response = await fetch(
          "http://10.0.2.2:4000/api/shopping-list",
          {
            headers: {
              authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load shopping list.");
        }

        groupItems(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch shopping list:", error);
      Alert.alert("Error", "Could not load your shopping list.");
    } finally {
      setLoading(false);
    }
  };

  const groupItems = (data) => {
    const groups = data.reduce((result, item) => {
      let category = "Other";
      let itemName = item.name;

      if (item.name.includes(": ")) {
        const parts = item.name.split(": ");
        category = parts[0];
        itemName = parts.slice(1).join(": ");
      }

      let group = result.find((entry) => entry.name === category);

      if (!group) {
        group = { id: category, name: category, items: [] };
        result.push(group);
      }

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

  const addShoppingList = async () => {
    if (!listName.trim()) {
      Alert.alert("Error", "Please specify the list name.");
      return;
    }

    const validItems = items.filter((item) => item.trim() !== "");

    if (validItems.length === 0) {
      Alert.alert("Error", "Please add at least one item.");
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      if (user.isGuest) {
        const shoppingListId = await getOrCreateShoppingList(user.id);

        for (const text of validItems) {
          await addShoppingListItem(
            shoppingListId,
            `${listName.trim()}: ${text.trim()}`
          );
        }
      } else {
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

      setListName("");
      setItems([""]);
      await fetchItems();
    } catch (error) {
      console.error("Failed to save shopping list:", error);
      Alert.alert("Error", "Could not save your shopping list.");
      setLoading(false);
    }
  };

  const deleteList = async (deleteId) => {
    const group = lists.find((entry) => entry.id === deleteId);
    if (!group || !user) return;

    setLoading(true);

    try {
      if (user.isGuest) {
        for (const item of group.items) {
          await deleteShoppingListItem(item.id);
        }
      } else {
        for (const item of group.items) {
          await item.originalItem.delete.data(user.token);
        }
      }

      await fetchItems();
    } catch (error) {
      console.error("Failed to delete shopping list:", error);
      Alert.alert("Error", "Could not delete the shopping list.");
      setLoading(false);
    }
  };

  const editListTitle = async (oldTitle, newTitle) => {
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
        const db = await getDatabase();

        for (const item of group.items) {
          await db.runAsync(
            "UPDATE shopping_list_items SET name = ? WHERE id = ?",
            `${newTitle.trim()}: ${item.text}`,
            item.id
          );
        }
      } else {
        for (const item of group.items) {
          await item.originalItem.edit.data(user.token, {
            name: `${newTitle.trim()}: ${item.text}`,
          });
        }
      }

      await fetchItems();
    } catch (error) {
      console.error("Failed to rename shopping list:", error);
      Alert.alert("Error", "Could not rename the shopping list.");
      await fetchItems();
    }
  };

  const editListItem = async (itemId, newText, listTitle) => {
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
        const db = await getDatabase();

        await db.runAsync(
          "UPDATE shopping_list_items SET name = ? WHERE id = ?",
          `${listTitle}: ${newText.trim()}`,
          itemId
        );
      } else {
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

  const toggleItem = async (itemId, currentChecked) => {
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
        await setShoppingItemPurchased(itemId, !currentChecked);
      } else {
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
      console.error("Failed to update shopping item:", error);
      Alert.alert("Error", "Could not update the item.");
      await fetchItems();
    }
  };

  const handleItemChange = (text, index) => {
    const updatedItems = [...items];
    updatedItems[index] = text;
    setItems(updatedItems);
  };

  const addInput = () => {
    setItems((current) => [...current, ""]);
  };

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.shoppingContainer}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#6A569E"
            style={{ marginTop: 50 }}
          />
        ) : (
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

          <TextInput
            style={staticStyles.shopInput}
            placeholder="List Name"
            value={listName}
            onChangeText={setListName}
          />

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

            <TouchableOpacity
              style={staticStyles.addMore}
              onPress={addInput}
            >
              <Text style={staticStyles.addMoreText}>+</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={staticStyles.addButton}
            onPress={addShoppingList}
          >
            <Text style={staticStyles.addButtonText}>Save List</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Navigation activeTab="Shopping List" />
    </SafeAreaView>
  );
};

export default ShoppingList;
