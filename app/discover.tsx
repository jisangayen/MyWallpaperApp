import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Flame, Layers } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { NarowHeader } from "@/src/components/Universal/NarrowHeader";
import { WallpaperCard } from "@/src/components/WallpaperCard";
import { fetchWallpapers } from "@/src/services/api";
import { useWallpaperStore } from "@/src/store/wallpaperStore";
import { navigateToDetails } from "@/src/utils/navigateToDetails";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  {
    id: "1",
    title: "Trending",
    query: "popular",
    image:
      "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400",
    colors: ["#6366f1", "#a855f7"] as [string, string],
    accent: "#a855f7",
  },
  {
    id: "2",
    title: "Nature",
    query: "nature",
    image:
      "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=400",
    colors: ["#059669", "#0ea5e9"] as [string, string],
    accent: "#10b981",
  },
  {
    id: "3",
    title: "Animals",
    query: "wildlife",
    image:
      "https://images.pexels.com/photos/2564889/pexels-photo-2564889.jpeg?auto=compress&cs=tinysrgb&w=400",
    colors: ["#d97706", "#dc2626"] as [string, string],
    accent: "#f59e0b",
  },
  {
    id: "5",
    title: "Cars",
    query: "supercar",
    image:
      "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=400",
    colors: ["#ea580c", "#e11d48"] as [string, string],
    accent: "#f97316",
  },
  {
    id: "6",
    title: "Aesthetic",
    query: "aesthetic",
    image:
      "https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=400",
    colors: ["#7c3aed", "#be185d"] as [string, string],
    accent: "#9333ea",
  },
  {
    id: "7",
    title: "Minimal",
    query: "minimalist",
    image:
      "https://images.pexels.com/photos/962312/pexels-photo-962312.jpeg?auto=compress&cs=tinysrgb&w=400",
    colors: ["#334155", "#0f172a"] as [string, string],
    accent: "#64748b",
  },
  {
    id: "8",
    title: "AMOLED",
    query: "dark amoled",
    image:
      "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=400",
    colors: ["#09090b", "#1e1b4b"] as [string, string],
    accent: "#6366f1",
  },
  {
    id: "9",
    title: "Abstract",
    query: "abstract",
    image:
      "https://images.pexels.com/photos/114979/pexels-photo-114979.jpeg?auto=compress&cs=tinysrgb&w=400",
    colors: ["#2563eb", "#0d9488"] as [string, string],
    accent: "#3b82f6",
  },
];

function CategoryCard({
  cat,
  isSelected,
  onPress,
}: {
  cat: (typeof CATEGORIES)[0];
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isSelected ? 1.06 : 1,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.timing(glow, {
        toValue: isSelected ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isSelected]);

  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.06)", cat.accent + "99"],
  });

  return (
    <Animated.View style={{ transform: [{ scale }], marginRight: 14 }}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <Animated.View style={[styles.catOuter, { borderColor }]}>
          <LinearGradient
            colors={cat.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.catCard}
          >
            {/* Background image with overlay */}
            <Image
              source={{ uri: cat.image }}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.72)"]}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Bottom label */}
            <View style={styles.catLabel}>
              <Text style={styles.catTitle}>{cat.title}</Text>
              {isSelected && (
                <View
                  style={[styles.activePill, { backgroundColor: cat.accent }]}
                />
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function DiscoverScreen() {
  const router = useRouter();
  const wallpapers = useWallpaperStore((state) => state.wallpapers);
  const setWallpapers = useWallpaperStore((state) => state.setWallpapers);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [isLoading, setIsLoading] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;

  const loadData = async (cat: (typeof CATEGORIES)[0]) => {
    if (cat.id === selectedCategory.id) return;
    setSelectedCategory(cat);
    setIsLoading(true);
    const data = await fetchWallpapers(cat.query, 1);
    if (data) setWallpapers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const data = await fetchWallpapers(CATEGORIES[0].query, 1);
      if (data) setWallpapers(data);
      setIsLoading(false);
    };
    init();

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <NarowHeader />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Header ── */}
        <Animated.View
          style={[
            styles.heroRow,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View>
            <Text style={styles.heroEyebrow}>EXPLORE</Text>
            <Text style={styles.heroTitle}>Discover</Text>
          </View>
          <View style={styles.heroBadge}>
            <Layers color="#E23661" size={16} />
            <Text style={styles.heroBadgeText}>{CATEGORIES.length} genres</Text>
          </View>
        </Animated.View>

        {/* ── Category Cards ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              isSelected={selectedCategory.id === cat.id}
              onPress={() => loadData(cat)}
            />
          ))}
        </ScrollView>

        {/* ── Section Label ── */}
        <View style={styles.sectionRow}>
          <View
            style={[
              styles.sectionAccent,
              { backgroundColor: selectedCategory.accent },
            ]}
          />
          <Flame color={selectedCategory.accent} size={15} />
          <Text
            style={[styles.sectionLabel, { color: selectedCategory.accent }]}
          >
            {selectedCategory.title.toUpperCase()}
          </Text>
          <View style={styles.sectionLine} />
        </View>

        {/* ── Grid ── */}
        <View style={styles.gridWrapper}>
          {isLoading ? (
            <View style={styles.loadingRow}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.skeleton} />
              ))}
            </View>
          ) : (
            <FlashList
              data={wallpapers}
              numColumns={2}
              estimatedItemSize={280}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <WallpaperCard
                  imageUrl={item.thumbnail || item.url}
                  itemId={item.id}
                  index={index}
                  onPress={() => navigateToDetails(router, item, "home")}
                />
              )}
              contentContainerStyle={styles.list}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_W = 130;
const CARD_H = 80;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#060812" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  // Hero
  heroRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 8,
  },
  heroEyebrow: {
    color: "#E23661",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 2,
  },
  heroTitle: {
    color: "#f1f5f9",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(226,54,97,0.1)",
    borderWidth: 1,
    borderColor: "rgba(226,54,97,0.25)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroBadgeText: {
    color: "#E23661",
    fontSize: 11,
    fontWeight: "700",
  },

  // Category cards
  catScroll: {
    paddingLeft: 22,
    paddingRight: 10,
    paddingTop: 16,
    paddingBottom: 8,
  },
  catOuter: {
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  catCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  catLabel: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  catTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  activePill: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // Section row
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 22,
    marginTop: 20,
    marginBottom: 14,
  },
  sectionAccent: {
    width: 3,
    height: 14,
    borderRadius: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginLeft: 4,
  },

  // Grid
  gridWrapper: { minHeight: 600 },
  list: { paddingHorizontal: 8 },

  // Skeleton loading
  loadingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    gap: 8,
  },
  skeleton: {
    width: (width - 36) / 2,
    height: 240,
    borderRadius: 12,
    backgroundColor: "#0f172a",
  },
});
