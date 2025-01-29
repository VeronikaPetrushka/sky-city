import { View } from "react-native"
import Settings from "../components/Settings"
import Menu from "../components/Menu";

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <Settings />
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

export default SettingsScreen;