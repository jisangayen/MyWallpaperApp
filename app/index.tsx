import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { Header } from "../src/components/Universal/Header";
import { SearchBar } from "../src/components/Search/SearchBar";
import { FilterBar } from "../src/components/FilterBar";
import { WallpaperCard } from "../src/components/WallpaperCard";
import { Footer } from "@/src/components/Universal/Footer";
import { router } from "expo-router";
import { fetchWallpapers } from "../src/services/api";
import { GenreSlider } from "@/src/components/GenreSlider";

interface WallpaperItem {
  id: string;
  url: string;
  category: string;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Nature");
  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  const loadInitialData = async () => {
    setIsLoading(true);
    const data = await fetchWallpapers(activeCategory, 1);
    setWallpapers(data);
    setPage(1);
    setIsLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, [activeCategory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchWallpapers(activeCategory, 1, true);
    setWallpapers(data);
    setPage(1);
    setRefreshing(false);
  }, [activeCategory]);

  const loadMoreData = async () => {
    if (isMoreLoading) return;
    setIsMoreLoading(true);
    const nextPage = page + 1;
    const newData = await fetchWallpapers(activeCategory, nextPage);
    if (newData.length > 0) {
      setWallpapers((prev) => [...prev, ...newData]);
      setPage(nextPage);
    }
    setIsMoreLoading(false);
  };

  // Define the Header components as a single function to pass to FlatList
  const renderHeader = () => (
    <View>
      <Header title="Wallpapers" />
      <SearchBar />
      <FilterBar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      <GenreSlider onSelectGenre={(query: string) => setActiveCategory(query)} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 1. FIXED SECTION: These will NOT hide on scroll */}
      <Header title="Wallpapers" />
      <SearchBar />
      <FilterBar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {isLoading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={wallpapers}
          numColumns={2}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          
          // 2. SCROLLABLE SECTION: Only the GenreSlider hides when you scroll
          ListHeaderComponent={
            <GenreSlider onSelectGenre={(query: string) => setActiveCategory(query)} />
          }
          
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor="#6366f1"
              colors={["#6366f1"]} 
            />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isMoreLoading ? (
              <ActivityIndicator size="small" color="#6366f1" style={{ marginVertical: 20 }} />
            ) : null
          }
          renderItem={({ item, index }) => (
            <WallpaperCard
              imageUrl={item.url}
              index={index}
              onPress={() =>
  router.push({
    pathname: "/details/[id]",
    // Stringify the array so it can be passed as a param
    params: { id: item.id, allWallpapers: JSON.stringify(wallpapers) },
  })
}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 120,
    paddingHorizontal: 5,
  },
});