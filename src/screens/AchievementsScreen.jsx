import { View } from "react-native"
import Achievements from "../components/Achievements"

const AchievementsScreen = () => {
    return (
        <View style={styles.container}>
            <Achievements />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
};

export default AchievementsScreen;