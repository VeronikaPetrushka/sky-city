import React, { useState, useCallback } from "react";
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, Image, ScrollView, Alert, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icons from "./Icons";

const { height } = Dimensions.get('window')

const locations = [
    { location: require('../assets/locations/1.png') },
    { location: require('../assets/locations/2.png') },
    { location: require('../assets/locations/3.png') },
    { location: require('../assets/locations/4.png') },
]

const BuyLocations = () => {
    const navigation = useNavigation();
    const [score, setScore] = useState(0);
    const [locationsStatus, setLocationsStatus] = useState([]);

    const fetchLocationsStatus = async () => {
        try {
            const storedLocations = await AsyncStorage.getItem('locationsStatus');
            if (storedLocations) {
                setLocationsStatus(JSON.parse(storedLocations));
            } else {
                const initialStatuses = locations.map((location, index) => ({
                    ...location,
                    purchased: index === 0,
                    chosen: index === 0
                }));
                setLocationsStatus(initialStatuses);
                await AsyncStorage.setItem('locationsStatus', JSON.stringify(initialStatuses));
            }
        } catch (error) {
            console.error('Error fetching locations status from storage:', error);
        }
    };    

    console.log('locationsStatus: ', locationsStatus)

    const saveLocationsStatus = async (updatedStatus) => {
        setLocationsStatus(updatedStatus);
        await AsyncStorage.setItem('locationsStatus', JSON.stringify(updatedStatus));
    };

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
            fetchLocationsStatus();
            fetchScore();
        }, [])
    );

    const handlePress = async (index) => {
        if (locationsStatus[index].purchased) {
            if (locationsStatus[index].chosen) {
                Alert.alert('Info', 'This location is already chosen.');
                return;
            }
            const updatedStatus = locationsStatus.map((status, i) => ({
                ...status,
                chosen: i === index
            }));
            await saveLocationsStatus(updatedStatus);
        } else if (score >= 2000) {
            const updatedStatus = [...locationsStatus];
            updatedStatus[index].purchased = true;
            setScore(score - 2000);
            await AsyncStorage.setItem('score', (score - 2000).toString());
            await saveLocationsStatus(updatedStatus);
        } else {
            Alert.alert('Insufficient Score', 'You do not have enough score to purchase this location.');
        }
    };
    
    return (
        <ImageBackground source={require('../assets/back.png')} style={{flex: 1}}>
            <View style={styles.container}>
                <TouchableOpacity 
                    style={{alignSelf: 'flex-start', alignItems: 'center', marginBottom: 20, flexDirection: 'row'}}
                    onPress={() => navigation.goBack('')}
                    >
                    <View style={{height: 17, width: 12, marginRight: 10}}>
                        <Icons type={'back'} />
                    </View>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Locations</Text>

                <ScrollView style={{width: '100%'}}>
                    {
                        locations.map((location, index) => (
                            <View key={index} style={styles.card}>
                                <Image source={location.location} style={styles.image} />
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => handlePress(index)}
                                >
                                <Text style={styles.btnText}>
                                    {locationsStatus[index]?.chosen ? 'Chosen' : locationsStatus[index]?.purchased ? 'Purchased' : '2000'}
                                </Text>
                                {   !locationsStatus[index]?.chosen && !locationsStatus[index]?.purchased && (
                                    <View style={{width: 20, height: 20, marginLeft: 4}}>
                                        <Icons type={'norm'} />
                                    </View>
                                )
                                }
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                </ScrollView>

            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 0,
        paddingTop: height * 0.07,
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 33.41,
        marginBottom: 30
    },

    backText: {
        fontSize: 17,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 22
    },

    card: {
        width: '100%',
        height: 200,
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden'
    },

    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    btn: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#2a2a2a',
        flexDirection: 'row',
        alignItems: 'center'
    },

    btnText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 16.7
    }

});

export default BuyLocations;