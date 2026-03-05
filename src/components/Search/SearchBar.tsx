import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import { useRouter } from 'expo-router'; // Import the router

export const SearchBar = () => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      // Navigate to your search screen (e.g., app/search.tsx)
      onPress={() => router.push('/search')}
    >
      <View style={styles.searchSection}>
        <Search color="#94a3b8" size={20} style={styles.searchIcon} />
        <Text style={styles.placeholderText}>Search wallpapers...</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: -25,
    marginBottom: 20,
    zIndex: 10,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchIcon: {
    marginRight: 10,
  },
  placeholderText: {
    flex: 1,
    color: '#64748b', // Matches your placeholder color
    fontSize: 16,
    fontWeight: '500',
  },
});