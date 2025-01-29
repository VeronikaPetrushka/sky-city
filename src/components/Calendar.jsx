import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import Icons from './Icons';

const Calendar = () => {
    const navigation = useNavigation();
    const [norm, setNorm] = useState(null);
    const [drinks, setDrinks] = useState([]);
    const [backgroundLocation, setBackgroundLocation] = useState(require('../assets/locations/1.png'));

    const fetchChosenLocation = async () => {
        try {
            const storedLocations = await AsyncStorage.getItem('locationsStatus');
            if (storedLocations) {
                const locationsStatus = JSON.parse(storedLocations);
                const chosenLocation = locationsStatus.find(location => location.chosen);
                if (chosenLocation) {
                    setBackgroundLocation(chosenLocation.location);
                }
            }
        } catch (error) {
            console.error('Error fetching chosen location from storage:', error);
        }
    };

    console.log(backgroundLocation)

    const fetchNorm = async () => {
        try {
            const storedNorm = await AsyncStorage.getItem('norm');
            if (storedNorm) {
                setNorm(JSON.parse(storedNorm));
            }
        } catch (error) {
            console.error('Error fetching norm from storage:', error);
        }
    };

    const fetchDrinks = async () => {
        try {
            const storedDrinks = await AsyncStorage.getItem('drinks');
            if (storedDrinks) {
                const parsedDrinks = JSON.parse(storedDrinks);
                if (Array.isArray(parsedDrinks)) {
                    setDrinks(parsedDrinks);
                } else {
                    setDrinks([]);
                }
            } else {
                setDrinks([]);
            }
        } catch (error) {
            console.error('Error fetching drinks from storage:', error);
            setDrinks([]);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNorm();
            fetchDrinks();
            fetchChosenLocation();
        }, [])
    );

    const generateDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            dates.push(`${day}.${month}.${year}`);
        }
        return dates;
    };

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split('.');
        const date = new Date(`${year}-${month}-${day}`);
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    };

    const dates = generateDates();

    return (
        <ImageBackground source={backgroundLocation} style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.gridContainer}>
                {dates.map((date) => {
                    const dayDrinks = drinks.filter(drink => drink.date === date);
                    const totalDrinkSize = dayDrinks.reduce((sum, drink) => sum + parseFloat(drink.size), 0);
                    const progress = norm ? Math.min(totalDrinkSize / norm.norm, 1) : 0;

                    return (
                        <View key={date} style={{width: '34%', alignItems: 'center', marginBottom: 50}}>
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateText}>{formatDate(date)}</Text>
                                {dayDrinks.length > 0 && norm && (
                                    <View style={styles.progressContainer}>
                                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                                            <View style={{width: 12, height: 12, marginRight: 5}}>
                                                <Icons type={'bottle'} />
                                            </View>
                                            <Text style={styles.normText}>{norm.norm} ml</Text>
                                        </View>
                                        <Progress.Bar
                                            progress={progress}
                                            width={64}
                                            height={11}
                                            color="#222be6"
                                            borderWidth={0}
                                            borderRadius={12}
                                            style={styles.progressBar}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <TouchableOpacity style={styles.buyBtn} onPress={() => navigation.navigate('BuyLocationsScreen')}>
                <Text style={styles.buyBtnText}>Buy new locations</Text>
            </TouchableOpacity>    

        </ImageBackground>
    );
};

const styles = StyleSheet.create({

    gridContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 120,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    dateContainer: {
        width: 80,
        height: 80,
        alignItems: 'center',
        paddingVertical: 13,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#fff'
    },

    dateText: {
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 14.32,
        color: '#9e7125',
        marginBottom: 10,
    },

    progressContainer: {
        alignItems: 'center',
        width: '100%'
    },

    progressBar: {
        backgroundColor: '#9e7125'
    },

    normText: {
        fontSize: 10,
        fontWeight: '700',
        lineHeight: 12,
        color: '#222be6',
    },

    noDataText: {
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 14.32,
        color: '#9e7125',
    },

    buyBtn: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 13,
        borderRadius: 16,
        backgroundColor: '#b58c32',
        position: 'absolute',
        bottom: 110,
        alignSelf: 'center',
        zIndex: 10
    },

    buyBtnText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        lineHeight: 22
    },

});

export default Calendar;
