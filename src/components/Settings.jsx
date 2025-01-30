import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Linking, ImageBackground } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const Settings = () => {
    const navigation = useNavigation();
    const [score, setScore] = useState(0);

    const fetchScore = async () => {
        try {
            const storedScore = await AsyncStorage.getItem('score');
            setScore(storedScore ? parseInt(storedScore, 10) : 0);
        } catch (error) {
            console.error('Error fetching score from storage:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchScore();
        }, [])
    );

    const privacyPolicy = () => {
        const url = 'https://www.termsfeed.com/live/a474b19e-2be8-4950-8ce7-c8d647ec6843'; 
        Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
    };   

    return (
        <ImageBackground source={require('../assets/back.png')} style={{flex: 1}}>
            <View style={styles.container}>

                <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 33}}>
                    <Text style={styles.title}>Settings</Text>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        <Text style={styles.score}>{score}</Text>
                        <View style={{width: 21, height: 21, marginLeft: 7}}>
                            <Icons type={'norm'} />
                        </View>
                    </View>
                </View>

                <View style={styles.btn}>
                    <Text style={styles.btnText}>Personal goals</Text>
                    <TouchableOpacity 
                        style={{width: 12, height: 24}}
                        onPress={() => navigation.navigate('GoalsScreen')}
                        >
                        <Icons type={'arrow'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>Achievements</Text>
                    <TouchableOpacity 
                        style={{width: 12, height: 24}}
                        onPress={() => navigation.navigate('AchievementsScreen')}
                        >
                        <Icons type={'arrow'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>Privacy policy</Text>
                    <TouchableOpacity 
                        style={{width: 12, height: 24}}
                        onPress={privacyPolicy}
                        >
                        <Icons type={'arrow'} />
                    </TouchableOpacity>
                </View>

            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 16,
        paddingTop: height * 0.07
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 33.41
    },

    score: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 16.71,
    },

    btn: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        backgroundColor: '#151515',
        flexDirection: 'row',
        marginBottom: 16,
        padding: 18.5
    },

    btnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        lineHeight: 19.1
    }

})

export default Settings;