import { View, Text, Animated, Pressable, PanResponder, StyleSheet, TextInput } from "react-native";
import staticStyles from "../static/styles";
import { useRef, useState } from "react";
import Checkbox from 'expo-checkbox';

const DELETE_THRESHOLD = -110;

const ShoppingListRow = ({list, onDelete, toggleItem, onEditTitle, onEditItem}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [pastThreshold, setPastThreshold] = useState(false);

  const deleteOpacity = pan.x.interpolate({
    inputRange: [DELETE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const resetRow = () => {
    Animated.spring(pan, {
        toValue: {x: 0, y: 0},
        useNativeDriver: false,
    }).start();
    setPastThreshold(false);
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 8 &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),

      onPanResponderMove: (_, gestureState) => {
        const x = Math.min(0, gestureState.dx);
        pan.setValue({ x, y: 0 });

        const danger = x < DELETE_THRESHOLD;

        if (danger !== pastThreshold) {
            setPastThreshold(danger);
        }
    },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < DELETE_THRESHOLD) {
        Animated.spring(pan, {
            toValue: { x: -110, y: 0 },
            useNativeDriver: false,
        }).start();
        } else {
            resetRow();
        }
    },

        onPanResponderTerminate: resetRow, 
    })
  ).current;

  return (
    <View style={styles.rowBackground}>
        <Pressable style={styles.deleteButton} onPress={() => onDelete(list.id)}>
            <Animated.Text style={[styles.deleteText, {opacity: deleteOpacity}]}>
                Delete
            </Animated.Text>
        </Pressable>
        
        <Animated.View
        style={[staticStyles.listItem, pastThreshold && {backgroundColor: '#E7DDF7'}, 
            {transform: [{ translateX: pan.x }] },
        ]}
        {...panResponder.panHandlers}
        >
            <TextInput
            style={staticStyles.listTitle}
            value={list.name}
            onChangeText={(text) => onEditTitle(list.id, text)}
            placeholder="List name"
            />

            {list.items.map((listItem, index) => (
              <View key={listItem.id} style={staticStyles.itemRow}>
                <Checkbox
                style={staticStyles.checkbox}
                value={listItem.checked}
                onValueChange={() => toggleItem(listItem.id, listItem.checked)}
                color={listItem.checked ? '#6A569E' : undefined}
                />
                <TextInput
                style={[staticStyles.itemText, listItem.checked && staticStyles.itemTextChecked]}
                value={listItem.text}
                onChangeText={(text) => onEditItem(listItem.id, text, list.name)}
                placeholder={`Item #${index+1}`}/>
              </View>
            ))}
        </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
    rowBackground: {
        backgroundColor: 'red',
        borderRadius: 12,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginHorizontal: 15,
    },
    deleteButton: {
        width: 110,
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',       
    },
    deleteText: {
        color: 'white',
        fontWeight: '800',
    },
});

export default ShoppingListRow;