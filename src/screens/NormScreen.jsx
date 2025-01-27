import { View } from "react-native"
import Norm from "../components/Norm"
import Menu from "../components/Menu";

const NormScreen = () => {
    return (
        <View style={styles.container}>
            <Norm />
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

export default NormScreen;