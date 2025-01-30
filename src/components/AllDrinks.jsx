import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, Modal, ImageBackground } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const Tracker = () => {
    const navigation = useNavigation();
    const [drinks, setDrinks] = useState([]);
    const [groupedDrinks, setGroupedDrinks] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDrink, setSelectedDrink] = useState(null);

    const fetchDrinks = async () => {
        try {
            const storedDrinks = await AsyncStorage.getItem('drinks');
            if (storedDrinks) {
                const parsedDrinks = JSON.parse(storedDrinks);
                if (Array.isArray(parsedDrinks)) {
                    setDrinks(parsedDrinks);
                    groupDrinksByDate(parsedDrinks);
                } else {
                    setDrinks([]);
                    setGroupedDrinks({});
                }
            } else {
                setDrinks([]);
                setGroupedDrinks({});
            }
        } catch (error) {
            console.error('Error fetching drinks from storage:', error);
            setDrinks([]);
            setGroupedDrinks({});
        }
    };

    const groupDrinksByDate = (drinksList) => {
        const grouped = drinksList.reduce((acc, drink) => {
            const date = drink.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(drink);
            return acc;
        }, {});
    
        const sortedGroupedDrinks = Object.keys(grouped).sort((a, b) => {
            const dateA = a.split('.').reverse().join('-');
            const dateB = b.split('.').reverse().join('-');
            return new Date(dateA) - new Date(dateB);
        }).reduce((acc, date) => {
            acc[date] = grouped[date];
            return acc;
        }, {});
    
        setGroupedDrinks(sortedGroupedDrinks);
    };
    

    useFocusEffect(
        useCallback(() => {
            fetchDrinks();
        }, [])
    );

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
                    <TouchableOpacity onPress={() => navigation.goBack('')}>
                        <Text style={styles.dateBtn}>Back</Text>
                    </TouchableOpacity>
                </View>

                {Object.keys(groupedDrinks).length === 0 && (
                    <View style={{width: '100%', alignItems: 'center', marginTop: height * 0.1}}>
                        <Image source={require('../assets/decor/water.png')} style={styles.noImage} />
                        <Text style={styles.noText}>There aren’t any drinks recorded yet, please add something</Text>
                    </View>
                )}

                {Object.keys(groupedDrinks).map((date, index) => (
                    <View key={index} style={{width: '100%'}}>
                        <Text style={styles.dateTitle}>{date}</Text>

                        {groupedDrinks[date].map((drink, index) => (
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
                        ))}
                    </View>
                ))}

                <View style={{height: 200}} />

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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: height * 0.07,
        alignItems: 'center',
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
        lineHeight: 33.41,
    },

    dateBtn: {
        fontSize: 16,
        fontWeight: '400',
        color: '#b58c32',
        lineHeight: 19.1,
    },

    noImage: {
        width: 240,
        height: 240,
        resizeMode: 'contain',
        marginBottom: 12,
    },

    noText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        lineHeight: 19.1,
        textAlign: 'center',
    },

    dateTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 10,
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
    },

    addBtnText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        lineHeight: 22,
    },

    drinkCard: {
        width: '100%',
        backgroundColor: '#151515',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },

    drinkName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        lineHeight: 19.1,
    },

    drinkInfo: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 16.7,
    },

    drinkTime: {
        fontSize: 12,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 14.32,
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

});

export default Tracker;
