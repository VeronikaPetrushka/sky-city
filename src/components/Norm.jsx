import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, ImageBackground } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const Norm = () => {
    const navigation = useNavigation();
    const [norm, setNorm] = useState(null);
    const [score, setScore] = useState(0);

    const fetchScore = async () => {
        try {
            const storedScore = await AsyncStorage.getItem('score');
            setScore(storedScore ? parseInt(storedScore, 10) : 0);
        } catch (error) {
            console.error('Error fetching score from storage:', error);
        }
    };

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
    
    useFocusEffect(
        useCallback(() => {
            fetchScore();
            fetchNorm();
        }, [])
    );

    return (
        <ImageBackground source={require('../assets/back.png')} style={{flex: 1}}>
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <Text style={styles.title}>Water Norm</Text>
                    <View style={styles.waterNormBox}>
                        <Text style={styles.waterNorm}>{score}</Text>
                        <View style={{width: 21, height: 21, marginLeft: 7}}>
                            <Icons type={'norm'} />
                        </View>
                    </View>
                </View>

                {
                    norm ? (
                        <View style={{width: 255, height: 285, marginVertical: 'auto'}}>
                            <Image source={require('../assets/decor/saved.png')} style={{width: '100%', height: '100%', resizeMode: 'contain'}} />
                            <View style={styles.savedNormContainer}>
                                <Text style={styles.normText}>{norm.norm} ml</Text>
                                <Text style={styles.normSubText}>per day</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={{width: '100%', alignItems: 'center', marginVertical: 'auto'}}>
                            <Image source={require('../assets/decor/water.png')} style={styles.noImage} />
                            <Text style={styles.noText}>There is no information about your daily water norm</Text>
                        </View>
                    )
                }

                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddNormScreen', norm && {item: norm})}>
                    <Text style={styles.addBtnText}>{!norm ? 'Add information' : 'Edit norm'}</Text>
                </TouchableOpacity>    

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

    waterNormBox: {
        backgroundColor: '#2a2a2a',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },

    waterNorm: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 16.71,
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

    savedNormContainer: {
        position: 'absolute',
        top: 170,
        alignSelf: 'center',
        alignItems: 'center'
    },

    normText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        lineHeight: 28.64,
        marginBottom: 5
    },

    normSubText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 19.1
    }

})

export default Norm;