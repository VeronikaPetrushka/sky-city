import { View } from "react-native"
import Tracker from "../components/Tracker"
import Menu from "../components/Menu";

const TrackerScreen = () => {
    return (
        <View style={styles.container}>
            <Tracker />
            <View style={styles.menu}>
                <Menu />
            </View>
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
    menu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    }
}

export default TrackerScreen;