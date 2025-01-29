import { View } from "react-native"
import Goals from "../components/Goals"

const GoalsScreen = () => {
    return (
        <View style={styles.container}>
            <Goals />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
};

export default GoalsScreen;