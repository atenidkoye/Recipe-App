import { TouchableOpacity, Text } from "react-native"
import staticStyles from "../static/styles"

const TextButton = ({buttonText, onPress, style}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={staticStyles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

export default TextButton;