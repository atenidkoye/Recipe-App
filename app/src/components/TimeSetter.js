import { View, TextInput } from "react-native";
import IconButton from "./IconButton";
import img from "../static/img";
import staticStyles from "../static/styles";
import { useRef } from "react";

const TimeSetter = ({time, setTime}) => {

  const input = useRef(null);

  const updateTime = (text) => {
    if (isNaN(text) || !text) {
      input.current.clear();

      input.current.setNativeProps({text: ""})
      input.current.setNativeProps({text: time.toString()})
      return;
    }

    let number = Number(text);
    if (number < 0) {
      input.current.clear();
      input.current.setNativeProps({text: ""})
      input.current.setNativeProps({text: time.toString()})
      return;
    }
    
    setTime(number);
  }

  return (
    <View style={staticStyles.modalTimeContainer}>
      <IconButton icon={img.arrow} style={{transform: [{rotate: "180deg"}]}} onPress={() => setTime(time + 1)} />
      <TextInput
        defaultValue={`${time < 10 ? "0" : ""}${time}`}
        ref={input} 
        maxLength={2}
        style={staticStyles.modalTimeInput}
        onEndEditing={(event) => updateTime(event.nativeEvent.text)}
      ></TextInput>
      <IconButton icon={img.arrow} onPress={() => setTime(time - 1)} />
    </View>
  )
}

export default TimeSetter;