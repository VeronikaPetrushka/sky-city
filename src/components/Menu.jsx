import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const Menu = () => {
    const navigation = useNavigation();
    const [activeButton, setActiveButton] = useState('HomeScreen');

    const handleNavigate = (screen) => {
        setActiveButton(screen);
        navigation.navigate(screen)
    };    

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const currentRoute = navigation.getState().routes[navigation.getState().index].name;
            setActiveButton(currentRoute);
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>

            <View style={{alignItems: 'center'}}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('TrackerScreen')}>
                    <View style={{width: 24, height: 24}}>
                        <Icons type={'1'} active={activeButton === 'TrackerScreen'}/>
                    </View>
                </TouchableOpacity>
                <Text style={[styles.btnText, activeButton === 'TrackerScreen' && {color: '#B58C32'}]}>Tracker</Text>
            </View>

            <View style={{alignItems: 'center'}}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('NormScreen')}>
                    <View style={{width: 24, height: 24}}>
                        <Icons type={'2'} active={activeButton === 'NormScreen'}/>
                    </View>
                </TouchableOpacity>
                <Text style={[styles.btnText, activeButton === 'NormScreen' && {color: '#B58C32'}]}>Norm</Text>
            </View>

            <View style={{alignItems: 'center'}}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('CalendarScreen')}>
                    <View style={{width: 24, height: 24}}>
                        <Icons type={'3'} active={activeButton === 'CalendarScreen'}/>
                    </View>
                </TouchableOpacity>
                <Text style={[styles.btnText, activeButton === 'CalendarScreen' && {color: '#B58C32'}]}>Calendar</Text>
            </View>

            <View style={{alignItems: 'center'}}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('SettingsScreen')}>
                    <View style={{width: 24, height: 24}}>
                        <Icons type={'4'} active={activeButton === 'SettingsScreen'}/>
                    </View>
                </TouchableOpacity>
                <Text style={[styles.btnText, activeButton === 'SettingsScreen' && {color: '#B58C32'}]}>Settings</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        flexDirection: 'row',
        backgroundColor: '#151515',
    },
    
    button: {
        width: 35,
        height: 35,
        padding: 5
    },

    btnText: {
        color: '#999',
        fontSize: 11,
        marginLeft: 4,
        fontWeight: '700',
        lineHeight: 15
    }
});

export default Menu;
