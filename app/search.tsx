import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Text } from 'react-native';
import { ArrowLeft, X, Search, ArrowUpLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fetchWallpapers } from '../src/services/api';
import { WallpaperCard } from '../src/components/WallpaperCard';

interface WallpaperItem {
  id: string;
  url: string;
  category: string;
}

const SUGGESTION_DATABASE = [
  "House of the rising sun", "House music", "House of the dragon", "House of pain", "House architecture","Jisan"
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<WallpaperItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  // Suggestion Logic
  useEffect(() => {
    const startsWithH = searchText.toLowerCase().startsWith("j");
    if (startsWithH && results.length === 0 && searchText.length > 0) {
      const filtered = SUGGESTION_DATABASE.filter(item => 
        item.toLowerCase().startsWith(searchText.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchText, results]);

  // Initial Search Function
  const handleSearch = async (query: string) => {
    const searchQuery = query || searchText;
    if (searchQuery.trim().length === 0) return;

    setLoading(true);
    setSearchText(searchQuery);
    setSuggestions([]); 
    setPage(1); // Reset page for new search
    
    const data = await fetchWallpapers(searchQuery, 1);
    setResults(data);
    setLoading(false);
  };

  // Infinite Scroll Function
  const loadMoreResults = async () => {
    if (isMoreLoading || results.length === 0) return;

    setIsMoreLoading(true);
    const nextPage = page + 1;
    const newData = await fetchWallpapers(searchText, nextPage);
    
    if (newData.length > 0) {
      setResults(prev => [...prev, ...newData]); // Append new data
      setPage(nextPage);
    }
    setIsMoreLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#fff" size={26} />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            autoFocus
            style={styles.input}
            placeholder="Search wallpapers..."
            placeholderTextColor="#64748b"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              if (results.length > 0) setResults([]); // Clear results to show suggestions
            }}
            onSubmitEditing={() => handleSearch(searchText)}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => {setSearchText(""); setResults([]);}}>
              <X color="#64748b" size={22} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Suggestion List */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionList}>
          {suggestions.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.suggestionItem} 
              onPress={() => handleSearch(item)}
            >
              <View style={styles.suggestionLeft}>
                <Search color="#94a3b8" size={20} style={styles.searchIcon} />
                <Text style={styles.suggestionText}>{item}</Text>
              </View>
              <ArrowUpLeft color="#475569" size={20} style={{ transform: [{ rotate: '90deg' }] }} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#6366f1" /></View>
      ) : (
        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMoreResults} // Trigger load more
          onEndReachedThreshold={0.5}
          ListFooterComponent={isMoreLoading ? <ActivityIndicator color="#6366f1" style={{ margin: 20 }} /> : null}
          renderItem={({ item, index }) => (
            <WallpaperCard
              imageUrl={item.url}
              index={index}
              onPress={() =>
                router.push({
                  pathname: "/details/[id]",
                  params: { id: item.id, url: item.url },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 15, marginBottom: 10 },
  iconButton: { padding: 5 },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 50 },
  input: { flex: 1, color: '#fff', fontSize: 20 },
  suggestionList: { marginTop: 5 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, paddingHorizontal: 25 },
  suggestionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  searchIcon: { marginRight: 25 },
  suggestionText: { color: '#fff', fontSize: 17 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 10, paddingBottom: 20 },
});