import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

interface WallpaperCardProps {
  imageUrl: string;
  index: number; // Added index to handle the unique staggered heights
  onPress: () => void;
}

export const WallpaperCard = ({ imageUrl, index, onPress }: WallpaperCardProps) => {
  // Logic: Create a staggered effect (3 different heights) for a premium look
  const heights = [320, 260, 300];
  const cardHeight = heights[index % 3];

  return (
    <TouchableOpacity 
      style={[styles.card, { height: cardHeight }]} 
      activeOpacity={0.9} 
      onPress={onPress}
    >
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image}
        contentFit="cover"
        transition={800} // Smoother fade-in for premium feel
      />
      
      {/* Subtle overlay to give images more depth */}
      <View style={styles.overlay} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 24, // Extra rounded for a modern, high-end look
    overflow: 'hidden',
    backgroundColor: '#1e293b',
    // Premium Shadow (Glow Effect)
    elevation: 5,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)', 
  },
});