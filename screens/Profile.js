import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable, Image} from 'react-native';
import { validateEmail, validateName } from '../utils'
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements';
import useUpdate from '../utils/useUpdate';
import * as ImagePicker from 'expo-image-picker';

export default function Profile({navigation}) {
  const [firstName, onChangeFirstName] = useState('');
  const [lastName, onChangeLastName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [save, setSave] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [initials, setInitials] = useState('');

  // Function to handle image selection
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // Function to generate initials from the user's name
  const generateInitials = () => {
    const nameArray = firstName.split(' ');
    const lastnameArray = lastName.split(' ');
    const firstInitial = nameArray[0].charAt(0).toUpperCase();
    const lastNameInitial = lastnameArray[0].charAt(0).toUpperCase();
    setInitials(firstInitial + lastNameInitial);
  };

  // Function to handle image upload
  const handleImageUpload = () => {
    pickImage();
  };

  const [preferences, setPreferences] = useState({
    status: false,
    password: false,
    offers: false,
    newsletter: false,
  });

  useEffect(() => {
    // Populating preferences from storage using AsyncStorage.multiGet
    (async () => {
      try {
        const values = await AsyncStorage.multiGet(Object.keys(preferences));
        const initialState = values.reduce((acc, curr) => {
          // Every item in the values array is itself an array with a string key and a stringified value, i.e ['pushNotifications', 'false']
          acc[curr[0]] = JSON.parse(curr[1]);
          return acc;
        }, {});
        setPreferences(initialState);
      } catch (e) {
        Alert.alert(`An error occurred: ${e.message}`);
      }
    })();
  }, []);

  // This effect only runs when the preferences state updates, excluding initial mount
  useUpdate(() => {
    (async () => {
      // Every time there is an update on the preference state, we persist it on storage
      // The exercise requierement is to use multiSet API
      const keyValues = Object.entries(preferences).map((entry) => {
        return [entry[0], String(entry[1])];
      });
      try {
        await AsyncStorage.multiSet(keyValues);
      } catch (e) {
        Alert.alert(`An error occurred: ${e.message}`);
      }
    })();
  }, [save]);

  useEffect(()=>{
    retrieveData();
  }, [])

  useEffect(()=>{
    generateInitials();
  }, [firstName, lastName]);

  const updateState = (key) => () =>
    setPreferences((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@firstName', firstName);
      await AsyncStorage.setItem('@lastName', lastName);
      await AsyncStorage.setItem('@email', email);
      await AsyncStorage.setItem('@phoneNumber', phoneNumber);
      setSave(true);
    } catch (e) {
      console.error('Error storing data:', e);
    }
  };

  const retrieveData = async () => {
    try {
      const firstName = await AsyncStorage.getItem('@firstName');
      const lastName = await AsyncStorage.getItem('@lastName');
      const email = await AsyncStorage.getItem('@email');
      const phoneNumber = await AsyncStorage.getItem('@phoneNumber');
      if (firstName !== null) onChangeFirstName(firstName);
      if (lastName !== null) onChangeLastName(lastName);
      if (email !== null) onChangeEmail(email);
      if (phoneNumber !== null) setPhoneNumber(phoneNumber);
      
      setIsLoading(false);

    } catch (e) {
      console.error('Error retrieving data:', e);
    }
  };

  const fetchFonts = () => {
    return Font.loadAsync({
      'Karla-Regular': require('../assets/fonts/Karla-Regular.ttf'),
    });
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
                <Image source={require("../assets/images/Profile.png")} 
                                style={styles.imageProfileLittle} 
                                resizeMode="cover" />
            </View>
            
            <View style={styles.main}>
                <ScrollView style={styles.scrollViewContent} keyboardDismissMode="on-drag">

                    <Text style={styles.mainText}>Personal information</Text>

                    <View style={styles.profileBar}>

                      

                        <TouchableOpacity onPress={handleImageUpload}>
                          {image ? (
                            <Image source={{ uri: image }} 
                            style={styles.imageProfile} 
                            resizeMode="cover" />
                            // <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 100 }} />
                          ) : (
                            <View style={styles.imageNoProfile}>
                              <Text style={{ fontSize: 20, color: '#fff' }}>{initials}</Text>
                            </View>
                          )}
                          
                        </TouchableOpacity>
                        <Pressable style={styles.buttonChange} onPress={handleImageUpload}>
                            <Text style={styles.buttonChangeText}>Change</Text>
                        </Pressable>
                        <Pressable style={styles.buttonRemove}>
                            <Text style={styles.buttonRemoveText}>Remove</Text>
                        </Pressable>
                    </View>

                    <View style={styles.inputs}>
                        <Text style={styles.labelinput} >First name</Text>
                        <TextInput 
                                style={styles.input} 
                                value={firstName} 
                                onChangeText={onChangeFirstName} 
                            /> 

                        <Text style={styles.labelinput} >Last name</Text>
                        <TextInput 
                                style={styles.input} 
                                value={lastName} 
                                onChangeText={onChangeLastName} 
                            /> 

                        <Text style={styles.labelinput} >Email</Text>
                        <TextInput 
                                style={styles.input} 
                                value={email} 
                                onChangeText={onChangeEmail} 
                                keyboardType={"email-address"}
                            /> 

                        <Text style={styles.labelinput} >Phone number</Text>
                        <TextInput 
                                style={styles.input} 
                                value={phoneNumber} 
                                onChangeText={setPhoneNumber} 
                                keyboardType={"phone-pad"}
                            />

                        <Text style={styles.mainText}>Email notifications</Text>

                        <CheckBox
                            title='Order statuses'
                            checked={preferences.status}
                            checkedColor='#495e57'
                            uncheckedColor='#ccc'
                            onPress={updateState('status')}
                        />
                        <CheckBox
                            title='Password changes'
                            checked={preferences.password}
                            checkedColor='#495e57'
                            uncheckedColor='#ccc'
                            onPress={updateState('password')}
                        />
                        <CheckBox
                            title='Special offers'
                            checked={preferences.offers}
                            checkedColor='#495e57'
                            uncheckedColor='#ccc'
                            onPress={updateState('offers')}
                        />
                        <CheckBox
                            title='Newsletter'
                            checked={preferences.newsletter}
                            checkedColor='#495e57'
                            uncheckedColor='#ccc'
                            onPress={updateState('newsletter')}
                        />

                    </View>
                </ScrollView>

            </View>

            <View style={styles.logoutView}>
                <Pressable
                    style={styles.buttonLogout}
                    onPress={() => storeData()}
                    >
                    <Text style={styles.buttonLogoutText}>
                    Logout
                    </Text>
                </Pressable>
            </View>
            
            <View style={styles.footer}>
                <Pressable
                    style={validateEmail(email) && validateName(firstName) ? styles.buttonCancel : styles.buttonDisabled}
                    disabled={!validateEmail(email) || !validateName(firstName)}
                    onPress={() => cancel()}
                    >
                    <Text style={styles.buttonRemoveText}>
                    Discard Changes
                    </Text>
                </Pressable>
                <Pressable
                    style={validateEmail(email) && validateName(firstName) ? styles.button : styles.buttonDisabled}
                    disabled={!validateEmail(email) || !validateName(firstName)}
                    onPress={() => storeData()}
                    >
                    <Text style={styles.buttonText}>
                    Save Changes
                    </Text>
                </Pressable>
            </View>
          </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logoutView: {   
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  container2: {
    display: "flex",
    justifyContent: "space-between",
  },
  scrollViewContent: {
  },
  inputs: {
    marginTop: '4%',
  },
  header: {
    flex: 0.07,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 0.77,
    justifyContent: 'space-between'
  },
  footer: {
    flex: 0.16,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row'
  },
  container2: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
  },
  mainText: {
    padding: 20,
    fontSize: 22,
    color: '#000',
    fontFamily: 'Karla-Regular',
    fontWeight: '500',
  },
  regularText: {
    fontSize: 24,
    padding: 20,
    marginVertical: 8,
    textAlign: 'center',
  }, 
  image: {
    height: 50,
    justifyContent: 'center',
    marginTop: 25,
  },
  profileBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageProfile: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    borderRadius: 50,
    left: 23
  },
  imageNoProfile: { 
    width: 70, 
    height: 70, 
    borderRadius: 50, 
    backgroundColor: '#ccc', 
    alignItems: 'center', 
    justifyContent: 'center', 
    left: 23
  },
  imageProfileLittle: {
    position: 'absolute',
    right: '3%',
    top: '30%',
    width: 50,
    height: 50,
    justifyContent: 'center',
    borderRadius: 50,
  },
  input: { 
    height: 35, 
    margin: 10, 
    borderWidth: 1, 
    padding: 10, 
    fontSize: 16, 
    borderColor: '#ccc', 
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
    fontSize: 12,
  },
  textLoggedIn: {
    textAlign: 'center',
    color: '#EDEFEE',
    fontSize: 22,
  },
  labelinput: {
    marginLeft: '3%',
    fontSize: 14,
    fontFamily: 'Karla-Regular',
  },
  buttonLogout: {
    padding: 10,
    marginHorizontal: '5%',
    backgroundColor: '#F4CE14',
    borderRadius: 10,
    borderColor: '#000',
    width: '90%',
  },
  buttonLogoutText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  buttonChange: {
    padding: 10,
    marginLeft: '12%',
    backgroundColor: '#495e57',
    borderRadius: 10,
    borderColor: '#000',
    width: '20%',
  },
  buttonChangeText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
  buttonRemove: {
    padding: 10,
    marginLeft: '5%',
    borderColor: '#495e57',
    borderWidth: 1,
    width: '20%',
  },
  buttonCancel: {
    padding: 10,
    marginLeft: '5%',
    borderColor: '#495e57',
    borderWidth: 1,
    width: '30%',
    borderRadius: 10,
  },
  buttonRemoveText: {
    color: '#495e57',
    textAlign: 'center',
    fontSize: 12,
  },
});

