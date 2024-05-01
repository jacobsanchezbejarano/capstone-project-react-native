import { useEffect,useCallback, useState, useMemo } from 'react';
import { SafeAreaView, View, ScrollView, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable, Image, FlatList} from 'react-native';
import debounce from 'lodash.debounce';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUpdate from '../utils/useUpdate';
import Icon from 'react-native-vector-icons/FontAwesome';
import Filters from '../utils/Filters';
import {getSectionListData, useUpdateEffect} from '../utils';


import {
    createTable,
    getMenuItems,
    saveMenuItems,
    filterByQueryAndCategories,
  } from '../utils/database';

  const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
  const sections = ['Starters', 'Mains', 'Desserts', 'Drinks'];


export default function Home({navigation}) {
  const [firstName, onChangeFirstName] = useState('');
  const [lastName, onChangeLastName] = useState('');
  const [searchText, onChangeSearchText] = useState('');
  const [data, setData] = useState([]);
  const [save, setSave] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [initials, setInitials] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();

        if (!menuItems.length) {
          menuItems = await fetchData();
          saveMenuItems(menuItems);
        }

        setData(menuItems);
      } catch (e) {
        // Handle error
        Alert.alert(e.message);
      }
    })();
  }, []);

  const fetchData = async() => {
    // 1. Implement this function
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      const response_json = json.menu;
      return response_json;
      } catch (error) {
      console.error(error);
      } finally {
        setIsLoading(false);
      }
    
    // Fetch the menu from the API_URL endpoint. You can visit the API_URL in your browser to inspect the data returned
    // The category field comes as an object with a property called "title". You just need to get the title value and set it under the key "category".
    // So the server response should be slighly transformed in this function (hint: map function) to flatten out each menu item in the array,
    return [];
  }

  // Function to generate initials from the user's name
  const generateInitials = () => {
    const nameArray = firstName.split(' ');
    const lastnameArray = lastName.split(' ');
    const firstInitial = nameArray[0].charAt(0).toUpperCase();
    const lastNameInitial = lastnameArray[0].charAt(0).toUpperCase();
    setInitials(firstInitial + lastNameInitial);
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

  const retrieveData = async () => {
    try {
      const firstName = await AsyncStorage.getItem('@firstName');
      const lastName = await AsyncStorage.getItem('@lastName');
      const email = await AsyncStorage.getItem('@email');
      const phoneNumber = await AsyncStorage.getItem('@phoneNumber');
      if (firstName !== null) onChangeFirstName(firstName);
      if (lastName !== null) onChangeLastName(lastName);
      
    } catch (e) {
      console.error('Error retrieving data:', e);
    }
  };

  const fetchFonts = async () => {
    await Font.loadAsync({
      'Karla-Regular': require('../assets/fonts/Karla-Regular.ttf'),
      'MarkaziText-Regular': require('../assets/fonts/MarkaziText-Regular.ttf'),
    });
    setIsLoading(false);
    fetchData();
  }


  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
    };
    loadFonts();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          searchText,
          activeCategories
        );
        setData(menuItems);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, searchText]);

  const lookup = useCallback((q) => {
    onChangeSearchText(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  const ItemSeparator = () => (
    <View style={styles.separator} />
  );

  const menuItem = (item) => {
    return (
        <View style={styles.card} key={item.name}>
            <View style={styles.divCard}>
                <View>
                    <Text style={styles.titleCard}>{item.name}</Text>
                    <Text numberOfLines={2} style={styles.textCard}>{item.description}</Text>
                    <Text style={styles.priceCard}>${item.price}</Text>
                </View>
                <Image style={styles.imageCard} source={{ uri: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/'+item.image+'?raw=true' }}/>
            </View>
        </View>
    );
  }

  const handlePress = () => {
    navigation.navigate('Profile');
  }

  return (
    !isLoading && 
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
  
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
            
                <Image style={styles.image} resizeMode="contain" source={require("../assets/images/Logo.png")} />
                <Pressable style={image ? styles.imageProfileLittle : styles.imageNoProfileLittle} onPress={handlePress}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={styles.imageProfileLittle}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imageNoProfileLittle}>
                    <Text style={{ fontSize: 20, color: '#fff' }}>{initials}</Text>
                  </View>
                )}
              </Pressable>
            </View>
            
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

                        <View style={styles.profileBar}>

                        
                        </View>

                        <View style={styles.inputs}>
                            <Icon name="search" size={20} style={styles.icon} />
                            <TextInput 
                                    style={styles.input} 
                                    value={searchText} 
                                    onChangeText={onChangeSearchText} 
                                /> 

                        </View>
                </View>

                <View style={styles.orders}>
                    <Text style={styles.titleOrders}>ORDER FOR DELIVERY!</Text>
                    <View style={styles.optionsContainer}>
                      <Filters 
                       selections={filterSelections}
                       onChange={handleFiltersChange}
                       sections={sections}
                       />
                    </View>
                </View>

                <ItemSeparator />
                    
                <FlatList
                    data={data}
                    renderItem={({ item }) => menuItem(item)}
                    keyExtractor={(item) => item.name}
                    ItemSeparatorComponent={ItemSeparator}
                />

            </ScrollView>
            

        </SafeAreaView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  logoutView: {   
    display: 'flex',
    alignItems: 'center',
  },
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
  icon: {
    padding: 10,
    borderRadius: 40, 
    color:"#495e57", 
    backgroundColor:"#fff"
},
  inputs: {
    marginVertical: '4%',
    marginLeft: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    flex: 0.9,
    justifyContent: 'space-between',
    backgroundColor: '#495e57',
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
  orders: {
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  titleOrders: {
    fontFamily: 'Karla-Regular',
    fontSize: 22,
    fontWeight: 'bold',
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
    top: '10%',
    width: 50,
    height: 50,
    justifyContent: 'center',
    borderRadius: 50,
  },
  imageNoProfileLittle: {
    position: 'absolute',
    right: '3%',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: 50,
    backgroundColor: '#ccc', 
  },
  input: { 
    height: 35, 
    width: '85%',
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
  labelinput: {
    marginLeft: '3%',
    fontSize: 14,
    fontFamily: 'Karla-Regular',
  },
  card: {
    padding: 10,
    marginTop: 10,
  },
  titleCard: {
    fontFamily: 'Karla-Regular',
    fontSize: 24,
  },
  divCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textCard: {
    fontFamily: 'Karla-Regular',
    color: '#495e57',
    fontSize: 14,
    width: 320,
    paddingVertical: 10
  },
  priceCard: {
    fontFamily: 'Karla-Regular',
    color: '#495e57',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageCard: {
    width: 80,
    height: 80,
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
  }
});

