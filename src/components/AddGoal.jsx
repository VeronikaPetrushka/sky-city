import React, { useState } from "react";
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, TextInput, Image, ScrollView, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import Icons from "./Icons";

const { height } = Dimensions.get('window')

const AddGoal = () => {
    const navigation = useNavigation();
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [date, setDate] = useState('');
    const [saved, setSaved] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);

    const resetInput = (setter) => {
        setter('');
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
    
        if (selectedDate) {
            const now = new Date();
    
            if (selectedDate < now.setHours(0, 0, 0, 0)) {
                alert("Please select a future date.");
                return;
            }
    
            const day = selectedDate.getDate().toString().padStart(2, '0');
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = selectedDate.getFullYear();
    
            const formattedDate = `${day}.${month}.${year}`;

            setDate(formattedDate)

        }
    };    

    const handleSave = async () => {
        if (!name || !description || !date) {
            alert('Please fill out all fields to proceed.');
            return;
        }
    
        const newGoal = {
            name,
            description,
            date,
        };
    
        try {
            const storedGoals = await AsyncStorage.getItem('goals');
            
            const goalsArray = storedGoals ? JSON.parse(storedGoals) : [];
    
            goalsArray.push(newGoal);
    
            await AsyncStorage.setItem('goals', JSON.stringify(goalsArray));
    
            console.log('Updated goals:', goalsArray);
            setSaved(true);
    
        } catch (error) {
            console.error('Error saving goal:', error);
            alert('Failed to save the goal. Please try again.');
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
                        <View style={{width: '100%', height: '90%', alignItems: 'center'}}>
                            <Text style={styles.title}>New goal is successfully added</Text>
                            <View style={{width: 255, height: 285, marginVertical: 'auto'}}>
                                <Image source={require('../assets/decor/saved.png')} style={{width: '100%', height: '100%', resizeMode: 'contain'}} />
                                <View style={styles.savedNormContainer}>
                                    <Image source={require('../assets/decor/success.png')} style={{width: 130, height: 130, resizeMode: 'contain'}} />
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={{width: '100%', alignItems: 'flex-start'}}>
                            <Text style={styles.title}>Add new goal</Text>

                            <ScrollView style={{width: '100%'}}>
                                <Text style={styles.label}>Goal title</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Title"
                                        placeholderTextColor="#999"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                    {name ? (
                                        <TouchableOpacity style={styles.cross} onPress={() => resetInput(setName)}>
                                            <Icons type={'cross'} />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>

                                <Text style={styles.label}>Goal description</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Description"
                                        placeholderTextColor="#999"
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                    />
                                    {description ? (
                                        <TouchableOpacity style={styles.cross} onPress={() => resetInput(setDescription)}>
                                            <Icons type={'cross'} />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>

                                <Text style={styles.label}>Date</Text>
                                <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
                                    <TextInput
                                        style={[styles.input, {paddingLeft: 60}]}
                                        placeholder="DD.MM.YYYY"
                                        placeholderTextColor="#999"
                                        value={date}
                                        editable={false}
                                    />
                                    <View style={styles.dateIcon}>
                                        <Icons type={'date'} />
                                    </View>
                                    {date ? (
                                        <TouchableOpacity style={styles.cross} onPress={() => resetInput(setDate)}>
                                            <Icons type={'cross'} />
                                        </TouchableOpacity>
                                    ) : null}
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date ? new Date(date.split('.').reverse().join('-')) : new Date()} 
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleDateChange}
                                        themeVariant="dark"
                                    />
                                )}

                                <View style={{height: 200}} />
                            </ScrollView>

                        </View>
                    )
                }

                <TouchableOpacity 
                    style={[styles.saveBtn, 
                        !name || !description || !date && {backgroundColor: '#2a2a2a'}, 
                        saved && {backgroundColor: '#b58c32'}
                    ]} 
                    onPress={saved ? navigation.goBack : handleSave}
                    disabled={!saved && !name || !description || !date}
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

    iconsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        top: 15.5,
        right: 10,
        zIndex: 10 
    },

    cross: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: 15.5,
        right: 10,
        zIndex: 10 
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
        top: 100,
        alignSelf: 'center',
        alignItems: 'center'
    },

    dateIcon: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: 15,
        left: 20,
        zIndex: 10
    },

})

export default AddGoal;