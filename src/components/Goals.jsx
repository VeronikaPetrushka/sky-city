import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, ScrollView, Modal, ImageBackground } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const Goals = () => {
    const navigation = useNavigation();
    const [goals, setGoals] = useState([]);
    const [doneGoals, setDoneGoals] = useState([]);
    const [filteredGoals, setFilteredGoals] = useState(goals);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const fetchGoals = async () => {
        try {
            const storedGoals = await AsyncStorage.getItem('goals');
            if (storedGoals) {
                const parsedGoals = JSON.parse(storedGoals);
                if (Array.isArray(parsedGoals)) {
                    setGoals(parsedGoals);
                } else {
                    setGoals([]);
                }
            } else {
                setGoals([]);
            }
        } catch (error) {
            console.error('Error fetching goals from storage:', error);
            setGoals([]);
        }
    };

    const fetchDoneGoals = async () => {
        try {
            const storedDoneGoals = await AsyncStorage.getItem('doneGoals');
            if (storedDoneGoals) {
                const parsedDoneGoals = JSON.parse(storedDoneGoals);
                if (Array.isArray(parsedDoneGoals)) {
                    setDoneGoals(parsedDoneGoals);
                } else {
                    setDoneGoals([]);
                }
            } else {
                setDoneGoals([]);
            }
        } catch (error) {
            console.error('Error fetching done goals from storage:', error);
            setDoneGoals([]);
        }
    };
    
    const handleGoalAction = async (goal, index) => {
        try {
            if (doneGoals.some(doneGoal => doneGoal.name === goal.name)) {
                const updatedGoals = [...goals, goal];
                const updatedDoneGoals = doneGoals.filter(doneGoal => doneGoal.name !== goal.name);
                setGoals(updatedGoals);
                setDoneGoals(updatedDoneGoals);
                await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
                await AsyncStorage.setItem('doneGoals', JSON.stringify(updatedDoneGoals));
            } else {
                const updatedGoals = goals.filter((_, i) => i !== index);
                const updatedDoneGoals = [...doneGoals, goal];
                setGoals(updatedGoals);
                setDoneGoals(updatedDoneGoals);
                await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
                await AsyncStorage.setItem('doneGoals', JSON.stringify(updatedDoneGoals));
            }
        } catch (error) {
            console.error('Error handling goal action:', error);
        }
    };
    
    useFocusEffect(
        useCallback(() => {
            fetchGoals();
            fetchDoneGoals();
        }, [])
    );

    const handleDeleteGoal = async () => {
        try {
            const updatedGoals = filteredGoals.filter(goal => goal !== selectedGoal);
            await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
            setGoals(updatedGoals);
            setIsModalVisible(false);

            await fetchGoals();

        } catch (error) {
            console.error('Error deleting goal from storage:', error);
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

                <Text style={styles.title}>Personal goals</Text>

                <View style={styles.goalBtnsContainer}>
                    <TouchableOpacity 
                        style={[filteredGoals === goals ? styles.goalBtnChosen : styles.goalBtn]} 
                        onPress={() => setFilteredGoals(goals)}
                        >
                        <Text style={styles.goalBtnText}>In progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[filteredGoals === doneGoals ? styles.goalBtnChosen : styles.goalBtn]} 
                        onPress={() => setFilteredGoals(doneGoals)}
                        >
                        <Text style={styles.goalBtnText}>Done</Text>
                    </TouchableOpacity>
                </View>

                {
                    filteredGoals === goals && goals.length > 0 || filteredGoals === doneGoals && doneGoals.length > 0 ? (
                        <ScrollView style={{width: '100%'}}>
                            {
                                filteredGoals.map((goal, index) => (
                                    <View key={index} style={styles.card}>
                                        <Text style={styles.name}>{goal.name}</Text>
                                        <Text style={styles.description}>{goal.description}</Text>
                                        <Text style={styles.date}>due to {goal.date}</Text>
                                        <View style={styles.iconsContainer}>
                                            <TouchableOpacity 
                                                style={styles.toggleBtn} 
                                                onPress={() => handleGoalAction(goal, index)}
                                                >
                                                    {
                                                        doneGoals.some(doneGoal => doneGoal.name === goal.name) && (
                                                            <View style={{width: '100%', height: '100%'}}>
                                                                <Icons type={'yes'} />
                                                            </View>
                                                        )
                                                    }
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={{width: 24, height: 12}}
                                                onPress={() => {
                                                    setSelectedGoal(goal);
                                                    setIsModalVisible(true);
                                                }}
                                                >
                                                <Icons type={'dots'} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            }
                        </ScrollView>
                    ) : (
                        <View style={{width: '100%', alignItems: 'center', marginTop: height * 0.1}}>
                            <Image source={require('../assets/decor/water.png')} style={styles.noImage} />
                            <Text style={styles.noText}>There aren’t any goals you add</Text>
                        </View>    
                    )
                }

                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddGoalScreen')}>
                    <Text style={styles.addBtnText}>Add new goal</Text>
                </TouchableOpacity>   

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Delete goal</Text>
                            <Text style={styles.modalText}>Are you sure you want to delete this goal record?</Text>
                            <TouchableOpacity 
                                style={[styles.modalButton, {borderTopColor: '#808080', borderBottomColor: '#808080', borderTopWidth: 0.33, borderBottomWidth: 0.33}]} 
                                onPress={handleDeleteGoal}
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
        padding: 16,
        paddingTop: height * 0.07
    },

    backText: {
        fontSize: 17,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 22
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 33.41,
        marginBottom: 30
    },

    toggleBtn: {
        width: 20,
        height: 20,
        borderRadius: 30,
        borderWidth: 0.6,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },

    goalBtnsContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 12,
        backgroundColor: '#2c2c2c',
        flexDirection: 'row',
        padding: 2,
        marginBottom: 24
    },

    goalBtn: {
        width: '50%',
        padding: 9,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },

    goalBtnChosen: {
        width: '50%',
        padding: 9,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222be6'
    },

    goalBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
        lineHeight: 18,
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
        bottom: 30,
        alignSelf: 'center',
        zIndex: 10
    },

    addBtnText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        lineHeight: 22
    },

    card: {
        width: '100%',
        backgroundColor: '#151515',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24
    },

    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        lineHeight: 19.09,
        marginBottom: 8,
        width: '80%'
    },

    description: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 16.71,
        marginBottom: 12,
        width: '80%'
    },

    date: {
        fontSize: 12,
        fontWeight: '300',
        color: '#999',
        lineHeight: 14.32,
    },

    iconsContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        alignItems: 'center'
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

export default Goals;