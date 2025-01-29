import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, ScrollView } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const Achievements = () => {
    const navigation = useNavigation();  
    const [norm, setNorm] = useState(null);
    const [drinks, setDrinks] = useState([]);
    const [progresses, setProgresses] = useState([0, 0, 0, 0]);
  
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
          setDrinks(JSON.parse(storedDrinks));
        }
      } catch (error) {
        console.error('Error fetching drinks from storage:', error);
      }
    };
  
    const updateScore = async (points) => {
      try {
        const currentScore = await AsyncStorage.getItem('score');
        const newScore = (parseInt(currentScore) || 0) + points;
        await AsyncStorage.setItem('score', newScore.toString());
      } catch (error) {
        console.error('Error updating score:', error);
      }
    };
  
    const calculateProgress = () => {
      if (!norm || !drinks.length) return;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const isSameDay = (date1, date2) => date1.getTime() === date2.getTime();
  
      const getDrinksForDate = (targetDate) => {
        return drinks
          .filter(drink => {
            const [day, month, year] = drink.date.split('.');
            const drinkDate = new Date(`${year}-${month}-${day}`);
            return isSameDay(targetDate, drinkDate);
          })
          .reduce((sum, drink) => sum + parseFloat(drink.size), 0);
      };
  
      // Stay hydrated for a week straight
      let consecutiveDays = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        if (getDrinksForDate(checkDate) >= norm.norm) {
          consecutiveDays++;
        } else {
          break;
        }
      }
      const progress1 = Math.min((consecutiveDays / 7) * 100, 100);
  
      // Reach daily water goal for 5 consecutive days
      consecutiveDays = 0;
      for (let i = 0; i < 5; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        if (getDrinksForDate(checkDate) >= norm.norm) {
          consecutiveDays++;
        } else {
          break;
        }
      }
      const progress2 = Math.min((consecutiveDays / 5) * 100, 100);
  
      // Drink 8 glasses of water in a day
      const todayDrinks = drinks.filter(drink => drink.date === `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`);
      const progress3 = Math.min((todayDrinks.length / 8) * 100, 100);
  
      // Complete hydration challenge for 30 days
      consecutiveDays = 0;
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        if (getDrinksForDate(checkDate) >= norm.norm) {
          consecutiveDays++;
        } else {
          break;
        }
      }
      const progress4 = Math.min((consecutiveDays / 30) * 100, 100);
  
      setProgresses([progress1, progress2, progress3, progress4]);
  
      const rewards = [500, 700, 200, 2000];
      progresses.forEach(async (progress, index) => {
        if (progress === 100) {
          await updateScore(rewards[index]);
          setProgresses(prev => prev.map((p, i) => (i === index ? 0 : p)));
        }
      });
    };
  
    useFocusEffect(
      useCallback(() => {
        fetchNorm();
        fetchDrinks();
      }, [])
    );
  
    useEffect(() => {
      calculateProgress();
    }, [drinks, norm]);
  
    return (
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

            <Text style={styles.title}>Achievements</Text>

            <ScrollView style={{width: '100%'}}>
                {progresses.map((progress, index) => (
                    <View key={index} style={styles.card}>
                    <Text style={styles.task}>
                        {index === 0 ? 'Stay hydrated for a week straight!' :
                        index === 1 ? 'Reach your daily water goal for 5 consecutive days!' :
                        index === 2 ? 'Drink 8 glasses of water in a day!' :
                        'Complete a hydration challenge for 30 days!'}
                        </Text>
                        <View style={styles.progressContainer}>
                            <Progress.Bar
                                progress={progress / 100}
                                width={326}
                                height={22}
                                color="#222be6"
                                borderWidth={0}
                                borderRadius={12}
                                style={styles.progressBar}
                            />
                            <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>
                        </View>
                        <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text style={styles.prize}>Prize</Text>
                            <View style={styles.prizeBox}>
                                <Text style={styles.score}>
                                    {index === 0 ? '+700' :
                                    index === 1 ? '+500' :
                                    index === 2 ? '+200' :
                                    '+2000'}
                                </Text>
                                <View style={{width: 21, height: 21, marginLeft: 7}}>
                                    <Icons type={'norm'} />
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

        </View>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#000',
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

    score: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 16.71,
    },

    card: {
        width: '100%',
        backgroundColor: '#151515',
        borderRadius: 16,
        alignItems: 'center',
        padding: 16,
        marginBottom: 24
    },

    task: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 21.48,
        marginBottom: 16
    },

    prize: {
        fontSize: 16,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 19.09,
    },

    prizeBox: {
        backgroundColor: '#2a2a2a',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },

    progressContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },

    progressBar: {
        height: 22,
        backgroundColor: '#191919',
        borderRadius: 12,
    },

    progressText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        position: 'absolute',
        top: 3
    }

})

export default Achievements;