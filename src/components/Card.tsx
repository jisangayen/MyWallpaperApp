import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Image, 
  Dimensions 
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 20; // Logic for perfect 2-column spacing

// Dummy Data for the Grid
const DUMMY_DATA = Array.from({ length: 10 }).map((_, index) => ({
  id: index.toString(),
  image: `https://picsum.photos/seed/${index + 20}/400/600`,
}));

const CategoryDetailScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 1. Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Category Name</Text>
      </View>

      {/* 2. Standard 2-Column Grid */}
      <FlatList
        data={DUMMY_DATA}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={styles.card}
            onPress={() => console.log("Pressed image", item.id)}
          >
            <Image 
              source={{ uri: item.image }} 
              style={styles.image} 
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // Dark theme matching LivingSquire
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginRight: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    height: 250, // Fixed height for a "normal" 2-row layout
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default CategoryDetailScreen;