import { Modal, View, Text } from "react-native";
import staticStyles from "../static/styles";
import TextButton from "./TextButton";
import { useState } from "react";
import TimeSetter from "./TimeSetter";

const TimeModal = ({time, setTime, active, setActive}) => {

  const [hours, setHours] = useState(Math.floor(time / 60));
  const [minutes, setMinutes] = useState(time - (60 * Math.floor(time / 60)));

  const updateHours = (newHours) => {
    newHours = Math.max(0, newHours);
    setHours(newHours);
  }

  const updateMinutes = (newMinutes) => {
    if (newMinutes >= 60) {
      setHours(hours + 1);
      setMinutes(0);
    } else if (newMinutes < 0) {
      setHours(hours - 1);
      setMinutes(59);
    } else {
      setMinutes(newMinutes);
    }
  }
  
  const close = () => {
    setHours(Math.floor(time / 60));
    setMinutes(time - (60 * Math.floor(time / 60)));
    setActive(false);
  }

  const save = () => {
    setTime(hours * 60 + minutes);
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
        <Text style={[staticStyles.editorMainLabel, {marginTop: 13, marginLeft: 17}]}>Cooking time</Text>
          <View style={staticStyles.modalSlot}>
            <TimeSetter time={hours} setTime={updateHours} />
            <Text style={{fontSize: 32, fontWeight: "bold"}}>:</Text>
            <TimeSetter time={minutes} setTime={updateMinutes} />
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

export default TimeModal;