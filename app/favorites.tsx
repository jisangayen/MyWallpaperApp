import { FlashList } from "@shopify/flash-list";
import { useFocusEffect, useRouter } from "expo-router";
import { Heart, Search, Sparkles } from "lucide-react-native";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { WallpaperCard } from "../src/components/WallpaperCard";
import { useWallpaperStore } from "../src/store/wallpaperStore";

export default function FavoritesScreen() {
  const router = useRouter();

  const favoriteItems = useWallpaperStore((s) => s.favoriteItems);
  const loadFavorites = useWallpaperStore((s) => s.loadFavorites);

  // Reload from AsyncStorage every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Collection</Text>
          <Text style={styles.subTitle}>
            {favoriteItems.length} Premium Assets
          </Text>
        </View>
        <TouchableOpacity style={styles.iconCircle}>
          <Heart color="#f43f5e" size={20} fill="#f43f5e" />
        </TouchableOpacity>
      </View>

      {favoriteItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.glassCircle}>
            <Sparkles color="#6366f1" size={40} />
          </View>
          <Text style={styles.emptyTitle}>Empty Collection</Text>
          <Text style={styles.emptyDesc}>
            Tap the ❤️ on any wallpaper to save it here.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.push("/")}
          >
            <Search color="#fff" size={18} />
            <Text style={styles.exploreBtnText}>Find Wallpapers</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlashList
          data={favoriteItems}
          numColumns={2}
          estimatedItemSize={280}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <WallpaperCard
              imageUrl={item.thumbnail || item.url}
              index={index}
              onPress={() => router.push(`/details/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", paddingTop: 60 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subTitle: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
    marginTop: -2,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "rgba(244, 63, 94, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  glassCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptyDesc: {
    color: "#64748b",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#6366f1",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#6366f1",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  exploreBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  list: { paddingHorizontal: 8, paddingBottom: 120 },
});
