import React from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet, View, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 1. High-quality background images for each genre
const GENRES = [
  { id: '1', name: 'Amoled', query: 'dark amoled 4k', img: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '2', name: 'Cyberpunk', query: 'cyberpunk neon 4k', img: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '3', name: 'Minimal', query: 'minimalist 4k', img: 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '4', name: 'Nature', query: 'nature 8k', img: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400' },
  { id: '5', name: 'Anime', query: 'anime art 4k', img: 'https://images.pexels.com/photos/13554030/pexels-photo-13554030.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '6', name: 'Abstract', query: 'abstract art 4k', img: 'https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '7', name: 'Cars', query: 'supercars 4k', img: 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '8', name: 'Space', query: 'galaxy 4k', img: 'https://images.pexels.com/photos/41951/stellar-nebula-cygnus-wall-41951.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export const GenreSlider = ({ onSelectGenre }: { onSelectGenre: (query: string) => void }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Featured Genres</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={GENRES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => onSelectGenre(item.query)}
            style={styles.cardWrapper}
          >
            {/* 2. Using ImageBackground for the immersive "Amoled" look */}
            <ImageBackground 
              source={{ uri: item.img }} 
              style={styles.cardImage}
              imageStyle={{ borderRadius: 16 }}
            >
              {/* 3. Dark Gradient Overlay ensures text is visible on any image */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                style={styles.gradient}
              >
                <Text style={styles.text}>{item.name}</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginVertical: 10 },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 20,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  container: { 
    paddingLeft: 20, 
    paddingRight: 10,
  },
  cardWrapper: {
    width: 140,
    height: 85,
    marginRight: 12,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  gradient: {
    height: '100%',
    width: '100%',
    borderRadius: 16,
    justifyContent: 'flex-end',
    padding: 10,
  },
  text: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700', 
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
});