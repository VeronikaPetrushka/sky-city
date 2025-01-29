import { View } from "react-native"
import BuyLocations from "../components/BuyLocations"

const BuyLocationsScreen = () => {
    return (
        <View style={styles.container}>
            <BuyLocations />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default BuyLocationsScreen;