import { TouchableOpacity, Image } from "react-native"
import staticStyles from "../static/styles"

const IconButton = ({icon, onPress, style, iconStyle = {}}) => {

  return (
    <TouchableOpacity style={[staticStyles.iconButton, style]} onPress={onPress}>
      <Image source={icon} style={[staticStyles.iconButtonImage, iconStyle]} />
    </TouchableOpacity>
  )
}

export default IconButton;