import { Modal, View, Text } from "react-native";
import staticStyles from "../static/styles";
import TextButton from "./TextButton";
import { useEffect, useRef, useState } from "react";
import CategoryHolder from "./CategoryHolder";
import { fetchCategories } from "../utils/backendConn";

const CategoryModal = ({active, setActive, activeCategories, setActiveCategories}) => {

  const [categories, setCategories] = useState([]);
  
  const initialState = useRef(activeCategories);
  
  // Get all available categories from the server db
  // Split them into selected and not selected based on the recipe
  // Changes everytime a category gets selected/unselected
  useEffect(() => {
    async function loadCategories() {
      setCategories((await fetchCategories()).filter(category => activeCategories.every(c => c.name != category.name)
      ));
    }

    loadCategories();
  }, [activeCategories]);

  // Add or remove category from selected categories which in turn runs the use effect above
  const changeCategoryStatus = (statusActive, category) => {
    if (statusActive) {
      setActiveCategories([...activeCategories, category])
    } else {
      setActiveCategories([...activeCategories.filter(c => c != category)])
    }
  }

  // Cancel button -> Close the modal after resetting selected categories
  const close = () => {
    setActiveCategories([...initialState.current])
    setActive(false);
  }

  // Save button -> Close modal
  const save = () => {
    setActive(false);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={active}
    >
      <View style={staticStyles.modal}>
        <View style={staticStyles.modalView}>
          <Text Text style={[staticStyles.editorMainLabel, {marginTop: 13, marginLeft: 17}]}>Categories</Text>
          <View style={staticStyles.modalSlot}>
            <CategoryHolder active={false} categories={categories} changeFunction={changeCategoryStatus} />
            <CategoryHolder active={true} categories={activeCategories} changeFunction={changeCategoryStatus} />
          </View>
          <View style={staticStyles.editorButtons}>
            <TextButton buttonText="Cancel" onPress={close} style={[staticStyles.editorButton, staticStyles.cancelButton]} />
            <TextButton buttonText="Confirm" onPress={save} style={[staticStyles.editorButton, staticStyles.confirmButton]} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CategoryModal;