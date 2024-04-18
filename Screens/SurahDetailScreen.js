import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SurahDetailScreen = ({ route }) => {
  const { surah } = route.params;
  const [bookmark, setBookmark] = useState(0);

  useEffect(() => {
    retrieveBookmark();
  }, []);

  const handleScroll = (event) => {
    const position = event.nativeEvent.contentOffset.y;
    setBookmark(position);
    storeBookmark(position);
  };

  const storeBookmark = async (position) => {
    try {
      await AsyncStorage.setItem('bookmark', position.toString());
    } catch (error) {
      console.error('Error storing bookmark:', error);
    }
  };

  const retrieveBookmark = async () => {
    try {
      const position = await AsyncStorage.getItem('bookmark');
      if (position !== null) {
        setBookmark(parseInt(position));
      }
    } catch (error) {
      console.error('Error retrieving bookmark:', error);
    }
  };

  return (
    <ScrollView style={styles.container} onScroll={handleScroll}>
      <View style={styles.section}>
        <Text style={styles.title}>{surah.name}</Text>
        <Text style={styles.subtitle}>{surah.englishName} - {surah.englishNameTranslation}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Arabic Text</Text>
        {surah.ayahs.map((ayah) => (
          <Text key={ayah.number} style={styles.arabicText}>{ayah.text}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Translations</Text>
        {surah.ayahs.map((ayah) => (
          <View key={ayah.number}>
            <Text style={styles.translationText}>{ayah.text}</Text>
            {/* Add more translations here */}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Audio</Text>
        {/* Add audio player here if available */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  arabicText: {
    fontSize: 18,
    marginBottom: 4,
    textAlign: 'right',
  },
  translationText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default SurahDetailScreen;
