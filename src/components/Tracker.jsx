import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, ScrollView, Modal, ImageBackground } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import Icons from './Icons';

const { height, width } = Dimensions.get('window');

const Tracker = () => {
    const navigation = useNavigation();
    const [norm, setNorm] = useState(null);
    const [drinks, setDrinks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDrink, setSelectedDrink] = useState(null);


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

    console.log(norm)
    console.log(drinks)
    
    useFocusEffect(
        useCallback(() => {
            fetchNorm();
            fetchDrinks();
        }, [])
    );

    const getTodayDate = () => {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const todayDate = getTodayDate();
    const todayDrinks = drinks.filter(drink => drink.date === todayDate);

    const totalDrinkSize = todayDrinks.reduce((sum, drink) => sum + parseFloat(drink.size), 0);
    const progress = norm ? Math.min(totalDrinkSize / norm.norm, 1) : 0;

    const handleDeleteDrink = async () => {
        try {
            const updatedDrinks = drinks.filter(drink => drink !== selectedDrink);
            await AsyncStorage.setItem('drinks', JSON.stringify(updatedDrinks));
            setDrinks(updatedDrinks);
            setIsModalVisible(false);

            await fetchDrinks();

        } catch (error) {
            console.error('Error deleting drink from storage:', error);
        }
    };

    return (
        <ImageBackground source={require('../assets/back.png')} style={{flex: 1}}>
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <Text style={styles.title}>Water Tracker</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AllDrinksScreen')}>
                        <Text style={styles.dateBtn}>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</Text>
                    </TouchableOpacity>
                </View>

                {
                    norm && todayDrinks.length > 0 && (
                        <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 8}}>
                            <Text style={styles.normText}>{totalDrinkSize} ml</Text>
                            <Text style={styles.normText}>{norm.norm} ml</Text>
                        </View>    
                    )
                }

                { norm && todayDrinks.length > 0 && (
                    <View style={styles.progressContainer}>
                        <Progress.Bar
                            progress={progress}
                            width={width * 0.87}
                            height={44}
                            color="#222be6"
                            borderWidth={0}
                            borderRadius={12}
                            style={styles.progressBar}
                        />
                        <Text style={styles.progressText}>
                            {Math.min(progress * 100, 100).toFixed(1)}%
                        </Text>
                    </View>
                )}

                {
                    !norm && todayDrinks.length === 0 && (
                        <View style={{width: '100%', alignItems: 'center', marginTop: height * 0.1}}>
                            <Image source={require('../assets/decor/water.png')} style={styles.noImage} />
                            <Text style={styles.noText}>There is no information about your daily water norm and water intakes</Text>
                        </View>
                    )
                }

                {
                    !norm && todayDrinks.length > 0 && (
                        <View style={{width: '100%', alignItems: 'center', marginTop: height * 0.1}}>
                            <Image source={require('../assets/decor/water.png')} style={styles.noImage} />
                            <Text style={styles.noText}>There is no information about your daily water norm</Text>
                        </View>
                    )
                }

                {
                    todayDrinks.length === 0 && norm && (
                        <View style={{width: '100%', alignItems: 'center', marginTop: height * 0.1}}>
                            <Image source={require('../assets/decor/water.png')} style={styles.noImage} />
                            <Text style={styles.noText}>There is no information about your water intakes</Text>
                        </View>
                    )
                }

                {
                    !norm && (
                        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddNormScreen')}>
                            <Text style={styles.addBtnText}>Add information</Text>
                        </TouchableOpacity>    
                    )
                }

                {
                    norm && (
                        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddDrinkScreen')}>
                            <Text style={styles.addBtnText}>Add drinks</Text>
                        </TouchableOpacity>       
                    )
                }

                {
                    todayDrinks.length > 0 && (
                        <ScrollView style={{width: '100%'}}>
                            {
                                todayDrinks.map((drink, index) => (
                                    <View key={index} style={styles.drinkCard}>
                                        <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 12}}>
                                            <Text style={styles.drinkName}>{drink.name}</Text>
                                            <TouchableOpacity 
                                                style={{width: 24, height: 24}}
                                                onPress={() => {
                                                    setSelectedDrink(drink);
                                                    setIsModalVisible(true);
                                                }}
                                                >
                                                <Icons type={'dots'} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                                            <Text style={styles.drinkInfo}>{drink.type} / {drink.size}</Text>
                                            <Text style={styles.drinkTime}>{drink.time}</Text>
                                        </View>
                                    </View>
                                ))
                            }

                            <View style={{height: 250}} />
                        </ScrollView>
                    )
                }

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Delete drink</Text>
                            <Text style={styles.modalText}>Are you sure you want to delete this drink record?</Text>
                            <TouchableOpacity 
                                style={[styles.modalButton, {borderTopColor: '#808080', borderBottomColor: '#808080', borderTopWidth: 0.33, borderBottomWidth: 0.33}]} 
                                onPress={handleDeleteDrink}
                            >
                                <Text style={[styles.modalButtonText, {color: '#ed0103'}]}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.modalButton} 
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={[styles.modalButtonText, {color: '#b58c32'}]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        </ImageBackground>
    )
};

const styles= StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        paddingTop: height * 0.07,
        alignItems: 'center'
    },

    normText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#999',
        lineHeight: 16.71
    },

    upperContainer: {
        width: '100%',
        alignItems: 'center', 
        justifyContent: 'space-between',
         flexDirection: 'row',
         marginBottom: 30,
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 33.41
    },

    dateBtn: {
        fontSize: 16,
        fontWeight: '400',
        color: '#b58c32',
        lineHeight: 19.1
    },

    noImage: {
        width: 240,
        height: 240,
        resizeMode: 'contain',
        marginBottom: 12
    },

    noText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        lineHeight: 19.1,
        textAlign: 'center'
    },

    addBtn: {
        width: '100%',
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

    addBtnText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        lineHeight: 22
    },

    drinkCard: {
        width: '100%',
        backgroundColor: '#151515',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20
    },

    drinkName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        lineHeight: 19.1
    },

    drinkInfo: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 16.7
    },

    drinkTime: {
        fontSize: 12,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 14.32
    },

    progressContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },

    progressBar: {
        height: 44,
        backgroundColor: '#151515',
        borderRadius: 12,
    },

    progressText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        position: 'absolute',
        top: 15
    },

    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContainer: {
        width: '80%',
        padding: 16,
        paddingBottom: 0,
        backgroundColor: '#2c2c2c',
        borderRadius: 14,
        alignItems: 'center',
    },

    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
        lineHeight: 22,
        marginBottom: 5,
        textAlign: 'center',
        color: '#fff'
    },

    modalText: {
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 22,
        marginBottom: 16,
        textAlign: 'center',
        color: '#fff'
    },

    modalButton: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 11,
    },

    modalButtonText: {
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 22,
    },

})

export default Tracker;