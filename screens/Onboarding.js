import { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable, Image} from 'react-native';
import { validateEmail, validateName } from '../utils'
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function Onboarding({navigation, setIsOnboardingCompleted}) {
  const [firstName, onChangeFirstName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [clicked, setClicked] = useState(false);

  // Agrega esto al inicio de tu componente Onboarding
  useFocusEffect(
    useCallback(() => {
      // Aquí se ejecutará cuando el componente esté en foco
      // Si la variable clicked es verdadera, es decir, si se han guardado los datos,
      // recarga la aplicación.
      if (clicked) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }], // Asegúrate de que el nombre de la ruta coincida con el de tu componente
        });
      }
    }, [clicked]) // La dependencia clicked asegura que esta función se ejecute cada vez que clicked cambie
  );

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@onBoard', 'true');
      await AsyncStorage.setItem('@firstName', firstName);
      await AsyncStorage.setItem('@email', email);
      setIsOnboardingCompleted(true);
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


                <View style={styles.hero}>

                  <Text style={styles.titleHero}>Little Lemon</Text>
                  <View style={styles.heroContainer}>
                      <View style={styles.heroDiv}>
                          <Text style={styles.subTitleHero}>Chicago</Text>
                          <Text style={styles.textHero}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                      </View>
                      <Image style={styles.heroImage} resizeMode='cover' source={require("../assets/images/HeroImage.png")}/>
                  </View>

                </View>

                    <View style={styles.inputs}>
                        <Text style={styles.labelinput} >First name *</Text>
                        <TextInput 
                                style={styles.input} 
                                value={firstName} 
                                onChangeText={onChangeFirstName} 
                            /> 

                        <Text style={styles.labelinput} >Email *</Text>
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
    backgroundColor: '#fff',
  },
  container2: {
    display: "flex",
    justifyContent: "space-between",
  },
  scrollViewContent: {
  },
  inputs: {
    marginTop: '5%',
  },
  header: {
    flex: 0.11,
  },
  main: {
    flex: 0.77,
    justifyContent: 'space-between'
  },
  footer: {
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
    marginHorizontal: 12,
    fontSize: 22,
    color: '#aaa',
    fontWeight: 'bold',
    fontFamily: 'Karla-Regular',
  },
  hero: {
    flex: 0.9,
    justifyContent: 'space-between',
    backgroundColor: '#495e57',
    paddingBottom: 25,
  },
  titleHero: {
    paddingHorizontal: 12,
    color: '#F4CE14',
    fontFamily: 'MarkaziText-Regular',
    fontSize: 54,
  },
  subTitleHero: {
    paddingHorizontal: 12,
    color: '#ffffff',
    fontFamily: 'Karla-Regular',
    fontSize: 36,
  },
  textHero: {
    paddingHorizontal: 12,
    marginTop: 20,
    color: '#ffffff',
    fontFamily: 'Karla-Regular',
    fontSize: 20,
  },
  heroImage: {
    width: '30%',
    height: 140,
    borderRadius: 15,
    marginTop: 20
  },
  heroContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  heroDiv: {
    width: '70%',
  },
});

