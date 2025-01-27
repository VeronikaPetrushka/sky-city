import { View } from "react-native"
import AllDrinks from "../components/AllDrinks"

const AllDrinksScreen = () => {
    return (
        <View style={styles.container}>
            <AllDrinks />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
};

export default AllDrinksScreen;