import React, { useState, useEffect, useRef } from 'react';
import { Animated, View, ImageBackground, StyleSheet } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TrackerScreen from './src/screens/TrackerScreen';
import AddNormScreen from './src/screens/AddNormScreen';
import AddDrinkScreen from './src/screens/AddDrinkScreen';
import AllDrinksScreen from './src/screens/AllDrinksScreen';
import NormScreen from './src/screens/NormScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import BuyLocationsScreen from './src/screens/BuyLocationsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import AddGoalScreen from './src/screens/AddGoalScreen';

enableScreens();

const Stack = createStackNavigator();

const App = () => {
    const [loaderIsEnded, setLoaderIsEnded] = useState(false);

    const loaderAnim = useRef(new Animated.Value(0)).current;

    const firstLoaderImage = require('./src/assets/loaders/1.png');
    const secondLoaderImage = require('./src/assets/loaders/2.png');

    const [currentLoader, setCurrentLoader] = useState(firstLoaderImage);

    useEffect(() => {
        Animated.timing(loaderAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start(() => {
            setCurrentLoader(secondLoaderImage);

            loaderAnim.setValue(0);
            Animated.timing(loaderAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }).start(() => {
                setLoaderIsEnded(true);
            });
        });
    }, []);
    
    return (
      <NavigationContainer>
        {
            !loaderIsEnded ? (
                <View style={{ flex: 1 }}>
                    <ImageBackground style={{ flex: 1 }} source={currentLoader}>
                        <View style={styles.container}>
                            <Animated.View style={[styles.imageContainer, { opacity: loaderAnim }]}>
                                <ImageBackground source={currentLoader} style={styles.image} />
                            </Animated.View>
                        </View>
                    </ImageBackground>
                </View>
            ) : (
              <Stack.Navigator initialRouteName="TrackerScreen">
                  <Stack.Screen 
                      name="TrackerScreen" 
                      component={TrackerScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="AddNormScreen" 
                      component={AddNormScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="AddDrinkScreen" 
                      component={AddDrinkScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="AllDrinksScreen" 
                      component={AllDrinksScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="NormScreen" 
                      component={NormScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="CalendarScreen" 
                      component={CalendarScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="BuyLocationsScreen" 
                      component={BuyLocationsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="SettingsScreen" 
                      component={SettingsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="AchievementsScreen" 
                      component={AchievementsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="GoalsScreen" 
                      component={GoalsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="AddGoalScreen" 
                      component={AddGoalScreen} 
                      options={{ headerShown: false }} 
                  />
              </Stack.Navigator>
            )
        }
      </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

export default App;
