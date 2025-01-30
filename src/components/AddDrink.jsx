import React, { useState } from "react";
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, TextInput, Image, ScrollView, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import Icons from "./Icons";

const { height } = Dimensions.get('window')

const AddDrink = () => {
    const navigation = useNavigation();
    const [name, setName] = useState(null);
    const [size, setSize] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [saved, setSaved] = useState(false);
    const [type, setType] = useState(null);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showTypes, setShowTypes] = useState(false);

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

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);

        if (selectedTime) {
            const hours = selectedTime.getHours();
            const minutes = selectedTime.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

            setTime(formattedTime);
        }
    };

    const handleTypesShow = () => {
        if(showTypes) {
            setShowTypes(false);
        } else {
            setShowTypes(true);
        }
    };

    const handleSave = async () => {
        if (!name || !size || !date || !time || !type) {
            alert('Please fill out all fields to proceed.');
            return;
        }
    
        const newDrink = {
            name,
            size,
            date,
            time,
            type
        };
    
        try {
            const storedDrinks = await AsyncStorage.getItem('drinks');
            
            const drinksArray = storedDrinks ? JSON.parse(storedDrinks) : [];
    
            drinksArray.push(newDrink);
    
            await AsyncStorage.setItem('drinks', JSON.stringify(drinksArray));
    
            console.log('Updated drinks:', drinksArray);
            setSaved(true);
    
        } catch (error) {
            console.error('Error saving drink:', error);
            alert('Failed to save the drink. Please try again.');
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
                            <Text style={styles.title}>New drink is successfully added</Text>
                            <View style={{width: 255, height: 285, marginVertical: 'auto'}}>
                                <Image source={require('../assets/decor/saved.png')} style={{width: '100%', height: '100%', resizeMode: 'contain'}} />
                                <View style={styles.savedNormContainer}>
                                    <Image source={require('../assets/decor/success.png')} style={{width: 130, height: 130, resizeMode: 'contain'}} />
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={{width: '100%', alignItems: 'flex-start'}}>
                            <Text style={styles.title}>Add new drink</Text>

                            <ScrollView style={{width: '100%'}}>
                                <Text style={styles.label}>Name of a drink</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Name"
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

                                <Text style={styles.label}>Size</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType='numeric'
                                        placeholder="Choose below or input own"
                                        placeholderTextColor="#999"
                                        value={size}
                                        onChangeText={setSize}
                                    />
                                    {size ? (
                                        <TouchableOpacity style={styles.cross} onPress={() => resetInput(setSize)}>
                                            <Icons type={'cross'} />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                                <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: 24}}>
                                    <View style={{alignItems: 'center', marginRight: 15}}>
                                        <TouchableOpacity 
                                            style={[styles.sizeBtn, size === '200' && {backgroundColor: '#222be6'}]} 
                                            onPress={() => { setSize('200'); }}
                                            >
                                            <Icons type={'size-s'} />
                                        </TouchableOpacity>
                                        <Text style={[styles.sizeBtnText, size === '200' && {color: '#222be6'}]}>200 ml</Text>
                                    </View>
                                    <View style={{alignItems: 'center', marginRight: 15}}>
                                        <TouchableOpacity 
                                            style={[styles.sizeBtn, size === '300' && {backgroundColor: '#222be6'}]} 
                                            onPress={() => { setSize('300'); }}
                                            >
                                            <Icons type={'size-m'} />
                                        </TouchableOpacity>
                                        <Text style={[styles.sizeBtnText, size === '300' && {color: '#222be6'}]}>300 ml</Text>
                                    </View>
                                    <View style={{alignItems: 'center'}}>
                                        <TouchableOpacity 
                                            style={[styles.sizeBtn, size === '500' && {backgroundColor: '#222be6'}]} 
                                            onPress={() => { setSize('500'); }}
                                            >
                                            <Icons type={'size-l'} />
                                        </TouchableOpacity>
                                        <Text style={[styles.sizeBtnText, size === '500' && {color: '#222be6'}]}>500 ml</Text>
                                    </View>
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

                                <Text style={styles.label}>Time</Text>
                                <TouchableOpacity style={styles.inputContainer} onPress={() => setShowTimePicker(true)}>
                                    <TextInput
                                        style={[styles.input, {paddingLeft: 60}]}
                                        placeholder="HH:MM"
                                        placeholderTextColor="#999"
                                        value={time}
                                        editable={false}
                                    />
                                    <View style={styles.dateIcon}>
                                        <Icons type={'time'} />
                                    </View>
                                    {time ? (
                                        <TouchableOpacity style={styles.cross} onPress={() => resetInput(setTime)}>
                                            <Icons type={'cross'} />
                                        </TouchableOpacity>
                                    ) : null}
                                </TouchableOpacity>
                                {showTimePicker && (
                                    <DateTimePicker
                                        value={new Date()}
                                        mode="time"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleTimeChange}
                                        themeVariant="dark"
                                    />
                                )}

                                <Text style={styles.label}>Type of a drink</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType='numeric'
                                        placeholder="Press to see options"
                                        placeholderTextColor="#999"
                                        value={type}
                                        onChangeText={setType}
                                    />
                                    <View style={styles.iconsContainer}>
                                        <TouchableOpacity style={[styles.typeIcon, !showTypes && { transform: [{ rotate: '180deg' }] }]} onPress={handleTypesShow}>
                                            <Icons type={'type'} />
                                        </TouchableOpacity>
                                        {type ? (
                                            <TouchableOpacity style={{width: 24, height: 24}} onPress={() => resetInput(setType)}>
                                                <Icons type={'cross'} />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                </View>
                                {
                                    showTypes && (
                                        <View>
                                            <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 24}}>
                                                <Text style={styles.typeText}>Water</Text>
                                                <TouchableOpacity style={styles.typeBtn} onPress={() => setType('Water')}>
                                                    {
                                                        type === 'Water' && (
                                                            <View style={{width: '100%', height: '100%'}}>
                                                                <Icons type={'yes'} />
                                                            </View>
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 24}}>
                                                <Text style={styles.typeText}>Coffee</Text>
                                                <TouchableOpacity style={styles.typeBtn} onPress={() => setType('Coffee')}>
                                                    {
                                                        type === 'Coffee' && (
                                                            <View style={{width: '100%', height: '100%'}}>
                                                                <Icons type={'yes'} />
                                                            </View>
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 24}}>
                                                <Text style={styles.typeText}>Juice</Text>
                                                <TouchableOpacity style={styles.typeBtn} onPress={() => setType('Juice')}>
                                                    {
                                                        type === 'Juice' && (
                                                            <View style={{width: '100%', height: '100%'}}>
                                                                <Icons type={'yes'} />
                                                            </View>
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 24}}>
                                                <Text style={styles.typeText}>Tea</Text>
                                                <TouchableOpacity style={styles.typeBtn} onPress={() => setType('Tea')}>
                                                    {
                                                        type === 'Tea' && (
                                                            <View style={{width: '100%', height: '100%'}}>
                                                                <Icons type={'yes'} />
                                                            </View>
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 24}}>
                                                <Text style={styles.typeText}>Soda</Text>
                                                <TouchableOpacity style={styles.typeBtn} onPress={() => setType('Soda')}>
                                                    {
                                                        type === 'Soda' && (
                                                            <View style={{width: '100%', height: '100%'}}>
                                                                <Icons type={'yes'} />
                                                            </View>
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }

                                <View style={{height: 200}} />
                            </ScrollView>

                        </View>
                    )
                }

                <TouchableOpacity 
                    style={[styles.saveBtn, 
                        !name || !size || !date || !time || !type && {backgroundColor: '#2a2a2a'}, 
                        saved && {backgroundColor: '#b58c32'}
                    ]} 
                    onPress={saved ? navigation.goBack : handleSave}
                    disabled={!saved && !name || !size || !date || !time || !type}
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

    typeIcon: {
        width: 24,
        height: 24,
        marginRight: 15
    },

    typeText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 24,
    },

    sizeBtn: {
        width: 52,
        height: 52,
        borderRadius: 16,
        padding: 14,
        backgroundColor: '#2c2c2c',
        marginBottom: 5
    },

    sizeBtnText: {
        fontSize: 11,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 13.13
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
    },

    dateIcon: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: 15,
        left: 20,
        zIndex: 10
    },

    typeBtn: {
        width: 20,
        height: 20,
        borderRadius: 30,
        borderWidth: 0.6,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }

})

export default AddDrink;