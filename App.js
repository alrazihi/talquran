import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SurahCard from './components/SurahCard';
import SurahDetailScreen from './Screens/SurahDetailScreen'; // Import your SurahDetailScreen component

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SurahDetail" component={SurahDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  const [surahs, setSurahs] = useState([]);

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('quranicVerses');
      if (cachedData) {
        setSurahs(JSON.parse(cachedData));
      } else {
        const response = await fetch('https://api.alquran.cloud/v1/quran/ar.alafasy');
        const data = await response.json();
        if (data && data.data && data.data.surahs) {
          setSurahs(data.data.surahs);
          await AsyncStorage.setItem('quranicVerses', JSON.stringify(data.data.surahs));
        } else {
          console.error('Invalid response format:', data);
        }
      }
    } catch (error) {
      console.error('Error fetching surahs:', error);
    }
  };

  const navigateToSurahDetail = (surah) => {
    navigation.navigate('SurahDetail', { surah });
  };

  return (
    <ScrollView style={styles.container}>
      {surahs.map((surah) => (
        <SurahCard
          key={surah.number}
          surah={surah}
          onPress={() => navigateToSurahDetail(surah)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default App;
