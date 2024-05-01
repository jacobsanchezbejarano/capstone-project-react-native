import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Onboarding from './screens/Onboarding';
import Splash from './screens/Splash';
import Home from './screens/Home';
import Profile from './screens/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    // Fetching stored data on component mount
    retrieveData();
    clearData()
  }, []);

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@onBoard', 'true');
      setIsOnboardingCompleted(true);
    } catch (e) {
      console.error('Error storing data:', e);
    }
  };

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('@onBoard');
      if (value !== null) {
        setIsOnboardingCompleted(value);
      } else {
        console.log('No data found!');
      }
      setIsLoading(false);
    } catch (e) {
      console.error('Error retrieving data:', e);
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Data cleared successfully!');
      setIsOnboardingCompleted(false);
    } catch (e) {
      console.error('Error clearing data:', e);
    }
  };
  
  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        { isOnboardingCompleted ? (
            <>
              <Stack.Screen name="Home" component={Home} /> 
              <Stack.Screen name="Profile" component={Profile} /> 
            </>
              )
            : <Stack.Screen name="Onboarding">
                  {props => <Onboarding {...props} setIsOnboardingCompleted={setIsOnboardingCompleted} />}
              </Stack.Screen>
        }
    </Stack.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
