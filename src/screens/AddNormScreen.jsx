import { View } from "react-native"
import AddNorm from "../components/AddNorm"

const AddNormScreen = ({ route }) => {
    const { item } = route.params || {};

    return (
        <View style={styles.container}>
            <AddNorm item={item} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default AddNormScreen;