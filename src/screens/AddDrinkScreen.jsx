import { View } from "react-native"
import AddDrink from "../components/AddDrink"

const AddDrinkScreen = () => {
    return (
        <View style={styles.container}>
            <AddDrink />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default AddDrinkScreen;