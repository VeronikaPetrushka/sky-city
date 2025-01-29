import { View } from "react-native"
import Calendar from "../components/Calendar"
import Menu from "../components/Menu";

const CalendarScreen = () => {
    return (
        <View style={styles.container}>
            <Calendar />
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

export default CalendarScreen;