import { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable, Image} from 'react-native';
import { validateEmail, validateName } from '../utils'
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Onboarding({navigation}) {
  const [firstName, onChangeFirstName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [clicked, setClicked] = useState(false);

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@onBoard', 'true');
      await AsyncStorage.setItem('@firstName', firstName);
      await AsyncStorage.setItem('@email', email);
    } catch (e) {
      console.error('Error storing data:', e);
    }
  };

  const fetchFonts = () => {
    return Font.loadAsync({
      'Karla-Regular': require('../assets/fonts/Karla-Regular.ttf'),
    });
  }

  const onclick = () => {
    setClicked(true);
    onChangeEmail('');
    onChangeFirstName('');
  }

  useEffect(() => {
    fetchFonts();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
  
          <View style={styles.container2}>
            <View style={styles.header}>
                <Image style={styles.image} resizeMode="contain" source={require("../assets/images/Logo.png")} />
            </View>
            
            <View style={styles.main}>
                <ScrollView style={styles.scrollViewContent} keyboardDismissMode="on-drag">


                    <Text style={styles.mainText}>Let us get to know you</Text>

                    <View style={styles.inputs}>
                        <Text style={styles.labelinput} >First name</Text>
                        <TextInput 
                                style={styles.input} 
                                value={firstName} 
                                onChangeText={onChangeFirstName} 
                            /> 

                        <Text style={styles.labelinput} >Email</Text>
                        <TextInput 
                                style={styles.input} 
                                value={email} 
                                onChangeText={onChangeEmail} 
                                keyboardType={"email-address"}
                            /> 
                    </View>
                </ScrollView>

            </View>
            
            <View style={styles.footer}>
                <Pressable
                    style={validateEmail(email) && validateName(firstName) ? styles.button : styles.buttonDisabled}
                    disabled={!validateEmail(email) || !validateName(firstName)}
                    onPress={() => storeData()}
                    >
                    <Text style={styles.buttonText}>
                    Next
                    </Text>
                </Pressable>
            </View>
          </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEFEE",
  },
  container2: {
    display: "flex",
    justifyContent: "space-between",
  },
  scrollViewContent: {
    backgroundColor: "#cecece",
  },
  inputs: {
    marginTop: '70%',
  },
  header: {
    backgroundColor: '#dedede',
    flex: 0.11,
  },
  main: {
    backgroundColor: '#ccc',
    flex: 0.77,
    justifyContent: 'space-between'
  },
  footer: {
    backgroundColor: '#dedede',
    flex: 0.16, // Ahora ocupa el 40% del espacio disponible
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  container2: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
  },
  mainText: {
    marginTop: '10%',
    padding: 20,
    fontSize: 22,
    color: '#000',
    fontFamily: 'Karla-Regular',
    textAlign: 'center',
  },
  regularText: {
    fontSize: 24,
    padding: 20,
    marginVertical: 8,
    color: '#EDEFEE',
    textAlign: 'center',
  }, 
  image: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    marginTop: 25,
  },
  input: { 
    height: 40, 
    margin: 12, 
    borderWidth: 1, 
    padding: 10, 
    fontSize: 16, 
    borderColor: '#000', 
    backgroundColor: 'white', 
    borderRadius: 10,
  },
  button: {
    padding: 10,
    marginHorizontal: '5%',
    backgroundColor: '#495e57',
    borderRadius: 10,
    borderColor: '#000',
    width: '30%',
  },
  buttonDisabled: {
    padding: 10,
    marginHorizontal: '5%',
    backgroundColor: '#495e57',
    borderRadius: 8,
    backgroundColor: '#bbb',
    width: '30%',
  },
  
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  textLoggedIn: {
    textAlign: 'center',
    color: '#EDEFEE',
    fontSize: 22,
  },
  labelinput: {
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Karla-Regular',
  },
  
});

