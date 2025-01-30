import React, { useState } from "react";
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, TextInput, Image, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Icons from "./Icons";

const { height } = Dimensions.get('window')

const AddNorm = ({ item }) => {
    const navigation = useNavigation();
    const [goal, setGoal] = useState(item?.goal || 'Maintenance');
    const [height, setHeight] = useState(item?.height || null);
    const [weight, setWeight] = useState(item?.weight || null);
    const [isExcess, setIsExcess] = useState(item?.isExcess || true);
    const [saved, setSaved] = useState(false);
    const [norm, setNorm] = useState(item?.norm || null);

    const resetInput = (setter) => {
        setter('');
    };

    const handleExcess = () => {
        if(isExcess) {
            setIsExcess(false);
        } else {
            setIsExcess(true);
        }
    };

    const calculateWaterNorm = (weight, isExcess, goal) => {
        const baseWaterIntake = weight * 0.033;
        let additionalWater = 0;

        if (isExcess) {
            additionalWater += Math.floor(weight / 10) * 0.2;
        }

        if (goal === "Weight loss") {
            additionalWater += 0.3;
        }

        const totalWaterIntakeLiters = baseWaterIntake + additionalWater;
        const totalWaterIntakeMl = totalWaterIntakeLiters * 1000;

    return Math.round(totalWaterIntakeMl);
    };

    const handleSave = async () => {
        if (!goal || !height || !weight) {
            alert('Please fill out all fields to proceed.');
            return;
        }
    
        const calculatedNorm = calculateWaterNorm(Number(weight), isExcess, goal);
        const newNorm = {
            goal,
            height,
            weight,
            isExcess,
            norm: calculatedNorm,
        };
    
        try {
            await AsyncStorage.setItem('norm', JSON.stringify(newNorm));
    
            console.log('Updated Norm:', newNorm);
            setNorm(calculatedNorm);
            setSaved(true)
    
        } catch (error) {
            console.error('Error saving norm:', error);
            alert('Failed to save the norm. Please try again.');
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

                {
                    saved ? (
                        <View style={{width: '100%', height: '90%', alignItems: 'center',}}>
                            <Text style={styles.title}>{item ? 'Your water norm is updated' : 'Your water norm is created'}</Text>
                            <View style={{width: 255, height: 285, marginVertical: 'auto'}}>
                                <Image source={require('../assets/decor/saved.png')} style={{width: '100%', height: '100%', resizeMode: 'contain'}} />
                                <View style={styles.savedNormContainer}>
                                    <Text style={styles.normText}>{norm} ml</Text>
                                    <Text style={styles.normSubText}>per day</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={{width: '100%', alignItems: 'flex-start'}}>
                            <Text style={styles.title}>{item ? 'Edit norm': 'Create norm'}</Text>

                            <Text style={styles.label}>Goal</Text>
                            <View style={styles.goalBtnsContainer}>
                                <TouchableOpacity 
                                    style={[goal === 'Maintenance' ? styles.goalBtnChosen : styles.goalBtn]} 
                                    onPress={() => setGoal('Maintenance')}
                                    >
                                    <Text style={styles.goalBtnText}>Maintenance</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[goal === 'Weight loss' ? styles.goalBtnChosen : styles.goalBtn]} 
                                    onPress={() => setGoal('Weight loss')}
                                    >
                                    <Text style={styles.goalBtnText}>Weight loss</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexDirection: 'row'}}>
                                <View style={{width: '48%'}}>
                                    <Text style={styles.label}>Height</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType='numeric'
                                            placeholder="Value"
                                            placeholderTextColor="#999"
                                            value={height}
                                            onChangeText={setHeight}
                                        />
                                        {height ? (
                                            <TouchableOpacity style={styles.cross} onPress={() => resetInput(setHeight)}>
                                                <Icons type={'cross'} />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                </View>
                                <View style={{width: '48%'}}>
                                    <Text style={styles.label}>Weight</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType='numeric'
                                            placeholder="Value"
                                            placeholderTextColor="#999"
                                            value={weight}
                                            onChangeText={setWeight}
                                        />
                                        {weight ? (
                                            <TouchableOpacity style={styles.cross} onPress={() => resetInput(setWeight)}>
                                                <Icons type={'cross'} />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                </View>
                            </View>

                            <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                                <Text style={[styles.label, {marginBottom: 0}]}>Excess weight</Text>
                                <TouchableOpacity style={styles.excessBtn} onPress={handleExcess}>
                                    {
                                        isExcess ? (
                                            <View style={{width: '100%', height: '100%'}}>
                                                <Icons type={'yes'} />
                                            </View>
                                        ) : (
                                            <View />
                                        )
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }

                <TouchableOpacity 
                    style={[styles.saveBtn, 
                        !height || !weight && {backgroundColor: '#2c2c2c2'}, 
                        saved && {backgroundColor: '#b58c32'}
                    ]} 
                    onPress={saved ? navigation.goBack : handleSave}
                    disabled={!saved && !height || !weight}
                    >
                    <Text style={styles.saveBtnText}>{saved ? 'Close' : 'Save'}</Text>
                </TouchableOpacity>

            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        paddingTop: height * 0.07,
        alignItems: 'center'
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

    label: {
        fontSize: 17,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 20.3,
        marginBottom: 16
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

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24
    },

    input: {
        width: '100%',
        fontSize: 16,
        fontWeight: '400',
        color: '#fff',
        backgroundColor: '#151515',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 16.5,
    },

    cross: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: 15.5,
        right: 10,
        zIndex: 10
    },

    excessBtn: {
        width: 20,
        height: 20,
        borderRadius: 30,
        borderWidth: 0.6,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },

    saveBtn: {
        width: '100%',
        padding: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222be6',
        borderRadius: 16,
        position: 'absolute',
        alignSelf: 'center',
        bottom: 50
    },

    saveBtnText: {
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

export default AddNorm;