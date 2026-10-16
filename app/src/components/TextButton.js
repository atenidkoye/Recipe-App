import { TouchableOpacity, Text } from "react-native"
import staticStyles from "../static/styles"

const TextButton = ({buttonText, onPress, style, textStyle = {}}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={[staticStyles.buttonText, textStyle]}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

export default TextButton;