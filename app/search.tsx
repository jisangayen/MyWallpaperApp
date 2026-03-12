import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Clock,
  Compass,
  Search,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WallpaperCard } from "../src/components/WallpaperCard";
import { fetchWallpapers } from "../src/services/api";
import { useWallpaperStore } from "../src/store/wallpaperStore";
import { navigateToDetails } from "../src/utils/navigateToDetails";

const { width } = Dimensions.get("window");
const PRIMARY_COLOR = "#EC0868";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TRENDING_TOPICS = [
  { label: "Aurora Borealis", emoji: "🌌" },
  { label: "Cyberpunk City", emoji: "🌆" },
  { label: "Ocean Waves", emoji: "🌊" },
  { label: "Dark Forest", emoji: "🌲" },
  { label: "Abstract Neon", emoji: "🎨" },
  { label: "Mountain Sunrise", emoji: "⛰️" },
  { label: "Space Galaxy", emoji: "🚀" },
  { label: "Cherry Blossom", emoji: "🌸" },
  { label: "Desert Dunes", emoji: "🏜️" },
  { label: "Rainy Street", emoji: "🌧️" },
  { label: "Minimalist", emoji: "◽" },
  { label: "Anime Landscape", emoji: "⛩️" },
];

const COLLECTIONS = [
  { label: "Nature & Landscapes", emoji: "🌿", query: "Nature landscape" },
  { label: "Urban & Architecture", emoji: "🌆", query: "Urban architecture" },
  { label: "Abstract & Art", emoji: "🎨", query: "Abstract art" },
  { label: "Space & Science", emoji: "🚀", query: "Space galaxy" },
  { label: "Animals & Wildlife", emoji: "🐾", query: "Wild animals" },
  { label: "Ocean & Water", emoji: "🌊", query: "Ocean waves" },
  { label: "Dark & Moody", emoji: "🌑", query: "Dark moody aesthetic" },
  { label: "Vintage & Retro", emoji: "📷", query: "Vintage retro" },
];

const SUGGESTION_DATABASE = [
  "Abstract art",
  "Abstract neon",
  "Aurora borealis",
  "Anime landscape",
  "Autumn forest",
  "Black and white",
  "Bokeh lights",
  "Cherry blossom",
  "Cyberpunk city",
  "Coastal sunset",
  "Dark forest",
  "Desert dunes",
  "Deep ocean",
  "Fantasy castle",
  "Foggy mountains",
  "Galaxy space",
  "Golden hour",
  "Green nature",
  "Geometric patterns",
  "Minimalist",
  "Mountain sunrise",
  "Milky way",
  "Neon lights",
  "Night city",
  "Ocean waves",
  "Pastel sky",
  "Rainy street",
  "Space nebula",
  "Sunset beach",
  "Storm clouds",
  "Tropical jungle",
  "Urban architecture",
  "Waterfall",
  "Winter snow",
  "Wild animals",
];

interface WallpaperItem {
  id: string;
  url: string;
  thumbnail?: string;
  category: string;
}

// ─── Recent Searches Hook ─────────────────────────────────────────────────────
const useRecentSearches = () => {
  const [recents, setRecents] = useState<string[]>([
    "Cyberpunk City",
    "Ocean Waves",
    "Aurora",
  ]);

  const add = useCallback((query: string) => {
    setRecents((prev) => {
      const filtered = prev.filter(
        (r) => r.toLowerCase() !== query.toLowerCase(),
      );
      return [query, ...filtered].slice(0, 8);
    });
  }, []);

  const remove = useCallback((query: string) => {
    setRecents((prev) => prev.filter((r) => r !== query));
  }, []);

  const clear = useCallback(() => setRecents([]), []);

  return { recents, add, remove, clear };
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SearchScreen() {
  const router = useRouter();
  const setSearchResults = useWallpaperStore((s) => s.setSearchResults);
  const appendSearchResults = useWallpaperStore((s) => s.appendSearchResults);
  const setActiveList = useWallpaperStore((s) => s.setActiveList);
  const {
    recents,
    add: addRecent,
    remove: removeRecent,
    clear: clearRecents,
  } = useRecentSearches();

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<WallpaperItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [page, setPage] = useState(1);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const inputRef = useRef<TextInput>(null);
  const loadingRef = useRef(false);

  // Animations
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const resultsAnim = useRef(new Animated.Value(0)).current;
  const suggestionsAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for loading
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading]);

  // Focus animation
  useEffect(() => {
    Animated.spring(searchBarAnim, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 12,
    }).start();
  }, [isFocused]);

  // Results animation
  useEffect(() => {
    if (results.length > 0) {
      Animated.spring(resultsAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }).start();
    } else {
      resultsAnim.setValue(0);
    }
  }, [results.length]);

  // Suggestions animation
  useEffect(() => {
    Animated.timing(suggestionsAnim, {
      toValue: suggestions.length > 0 ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [suggestions.length]);

  // Autocomplete
  useEffect(() => {
    if (searchText.trim().length === 0 || results.length > 0) {
      setSuggestions([]);
      return;
    }
    const q = searchText.toLowerCase();
    const filtered = SUGGESTION_DATABASE.filter((item) =>
      item.toLowerCase().includes(q),
    ).slice(0, 6);
    setSuggestions(filtered);
  }, [searchText, results.length]);

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = useCallback(
    async (query: string) => {
      const q = (query || searchText).trim();
      if (!q) return;

      Keyboard.dismiss();
      setIsFocused(false);
      setLoading(true);
      setSearchText(q);
      setSuggestions([]);
      setPage(1);
      setHasMore(true);
      addRecent(q);

      try {
        const data = await fetchWallpapers(q, 1);
        setResults(data ?? []);
        if (!data?.length) setHasMore(false);
      } catch (e) {
        console.error("Search error", e);
      } finally {
        setLoading(false);
      }
    },
    [searchText, addRecent],
  );

  // ── Load More ─────────────────────────────────────────────────────────────
  const loadMoreResults = useCallback(async () => {
    if (loadingRef.current || !results.length || !hasMore) return;
    loadingRef.current = true;
    setIsMoreLoading(true);
    try {
      const nextPage = page + 1;
      const newData = await fetchWallpapers(searchText, nextPage);
      if (newData?.length) {
        setResults((prev) => {
          const ids = new Set(prev.map((r) => r.id));
          return [
            ...prev,
            ...newData.filter((d: WallpaperItem) => !ids.has(d.id)),
          ];
        });
        appendSearchResults(newData); // ✅ keep store in sync
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error("Pagination error", e);
    } finally {
      setIsMoreLoading(false);
      loadingRef.current = false;
    }
  }, [searchText, page, results.length, hasMore]);

  // ── Clear ─────────────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    setSearchText("");
    setResults([]);
    setSuggestions([]);
    setIsFocused(true);
    setHasMore(true);
    setActiveList("home"); // ✅ switch back to home feed
    inputRef.current?.focus();
  }, [setActiveList]);

  const showDiscovery = isFocused && results.length === 0 && !loading;
  const showSuggestions = suggestions.length > 0 && searchText.length > 0;
  const showResults = !loading && results.length > 0;

  const borderColor = searchBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.06)", "rgba(99,102,241,0.6)"],
  });

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>

        <Animated.View style={[styles.inputWrapper, { borderColor }]}>
          <Search color={isFocused ? PRIMARY_COLOR : "#334155"} size={18} />
          <TextInput
            ref={inputRef}
            autoFocus
            style={styles.input}
            placeholder="Search wallpapers..."
            placeholderTextColor="#1e3a5f"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              if (results.length > 0) setResults([]);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              if (results.length > 0) setIsFocused(false);
            }}
            onSubmitEditing={() => handleSearch(searchText)}
            returnKeyType="search"
            selectionColor="#6366f1"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={styles.clearBtn}>
                <X color="#64748b" size={13} />
              </View>
            </TouchableOpacity>
          )}
        </Animated.View>

        {searchText.length > 0 && (
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => handleSearch(searchText)}
            activeOpacity={0.8}
          >
            <Zap color="#fff" size={18} fill="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Autocomplete ── */}
      {showSuggestions && (
        <Animated.View
          style={[
            styles.suggestionsBox,
            {
              opacity: suggestionsAnim,
              transform: [
                {
                  translateY: suggestionsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-8, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {suggestions.map((item, index) => {
            const matchIdx = item
              .toLowerCase()
              .indexOf(searchText.toLowerCase());
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionRow,
                  index === suggestions.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => handleSearch(item)}
                activeOpacity={0.6}
              >
                <View style={styles.suggestionLeft}>
                  <View style={styles.suggestionIcon}>
                    <Search color="#6366f1" size={13} />
                  </View>
                  <Text style={styles.suggestionText}>
                    <Text style={styles.suggestionNormal}>
                      {item.slice(0, matchIdx)}
                    </Text>
                    <Text style={styles.suggestionHighlight}>
                      {item.slice(matchIdx, matchIdx + searchText.length)}
                    </Text>
                    <Text style={styles.suggestionNormal}>
                      {item.slice(matchIdx + searchText.length)}
                    </Text>
                  </Text>
                </View>
                <Text style={styles.suggestionArrow}>↗</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}

      {/* ── Discovery ── */}
      {showDiscovery && !showSuggestions && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.discoveryContent}
        >
          {/* Recent Searches */}
          {recents.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Clock color="#334155" size={13} />
                  <Text style={styles.sectionTitle}>Recent</Text>
                </View>
                <TouchableOpacity onPress={clearRecents}>
                  <Text style={styles.clearAll}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recentChips}>
                {recents.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.recentChip}
                    onPress={() => handleSearch(item)}
                    activeOpacity={0.7}
                  >
                    <Clock color="#475569" size={12} />
                    <Text style={styles.recentChipText}>{item}</Text>
                    <TouchableOpacity
                      onPress={() => removeRecent(item)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <X color="#334155" size={12} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Trending */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <TrendingUp color="#334155" size={13} />
                <Text style={styles.sectionTitle}>Trending Now</Text>
              </View>
            </View>
            <View style={styles.trendingGrid}>
              {TRENDING_TOPICS.map((topic, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.trendingChip}
                  onPress={() => handleSearch(topic.label)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.trendingEmoji}>{topic.emoji}</Text>
                  <Text style={styles.trendingLabel}>{topic.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Collections */}
          <View style={[styles.section, { marginBottom: 100 }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Compass color="#334155" size={13} />
                <Text style={styles.sectionTitle}>Collections</Text>
              </View>
            </View>
            <View style={styles.collectionsGrid}>
              {COLLECTIONS.map((col, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.collectionCard}
                  onPress={() => handleSearch(col.query)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.collectionEmoji}>{col.emoji}</Text>
                  <Text style={styles.collectionLabel}>{col.label}</Text>
                  <View style={styles.collectionArrow}>
                    <Sparkles color="#6366f1" size={12} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {/* ── Loading ── */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingDots, { opacity: pulseAnim }]}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === 1 ? "#818cf8" : "#334155" },
                ]}
              />
            ))}
          </Animated.View>
          <Text style={styles.loadingText}>Finding wallpapers...</Text>
        </View>
      )}

      {/* ── Results ── */}
      {showResults && (
        <Animated.View
          style={[
            { flex: 1 },
            {
              opacity: resultsAnim,
              transform: [
                {
                  translateY: resultsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.resultsBar}>
            <Text style={styles.resultsCount}>
              <Text style={styles.resultsQuery}>"{searchText}" </Text>
              <Text style={styles.resultsMeta}>
                — {results.length}+ results
              </Text>
            </Text>
            <TouchableOpacity onPress={handleClear} style={styles.newSearchBtn}>
              <Text style={styles.newSearchText}>New Search</Text>
            </TouchableOpacity>
          </View>

          <FlashList
            data={results}
            numColumns={2}
            // estimatedItemSize={280}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={styles.listContent}
            onEndReached={loadMoreResults}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              isMoreLoading ? (
                <ActivityIndicator color="#6366f1" style={{ margin: 20 }} />
              ) : !hasMore && results.length > 0 ? (
                <Text style={styles.endText}>✦ You've seen it all ✦</Text>
              ) : null
            }
            renderItem={({ item, index }) => (
              <WallpaperCard
                imageUrl={item.thumbnail || item.url}
                itemId={item.id}
                index={index}
                onPress={() => {
                  setSearchResults(results);
                  navigateToDetails(router, item, "search"); // ✅ passes full image data
                }}
              />
            )}
          />
        </Animated.View>
      )}

      {/* ── Empty State ── */}
      {!loading &&
        results.length === 0 &&
        searchText.length > 0 &&
        !showSuggestions &&
        !isFocused && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different keyword or browse trending topics
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={handleClear}>
              <Text style={styles.emptyBtnText}>Back to Search</Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030712", paddingTop: 52 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 6,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#0d1526",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#080f1f",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1.5,
    gap: 10,
  },
  input: {
    flex: 1,
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },

  // Suggestions
  suggestionsBox: {
    marginHorizontal: 14,
    backgroundColor: "#080f1f",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.2)",
    overflow: "hidden",
    marginTop: 4,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  suggestionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  suggestionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(99,102,241,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionText: { fontSize: 14, flex: 1 },
  suggestionNormal: { color: "#475569" },
  suggestionHighlight: { color: "#e2e8f0", fontWeight: "700" },
  suggestionArrow: { color: "#334155", fontSize: 16 },

  // Discovery
  discoveryContent: { paddingHorizontal: 14, paddingTop: 10 },
  section: { marginTop: 28 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  sectionTitle: {
    color: "#334155",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  clearAll: { color: "#6366f1", fontSize: 12, fontWeight: "600" },

  // Recent chips
  recentChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0d1526",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  recentChipText: { color: "#64748b", fontSize: 13, fontWeight: "500" },

  // Trending
  trendingGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  trendingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#080f1f",
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.15)",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  trendingEmoji: { fontSize: 14 },
  trendingLabel: { color: "#94a3b8", fontSize: 13, fontWeight: "500" },

  // Collections grid (2 columns)
  collectionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  collectionCard: {
    width: (width - 28 - 10) / 2,
    backgroundColor: "#080f1f",
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.12)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 6,
  },
  collectionEmoji: { fontSize: 24, marginBottom: 2 },
  collectionLabel: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  collectionArrow: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(99,102,241,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingDots: { flexDirection: "row", gap: 8, alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4 },
  loadingText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  // Results
  resultsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  resultsCount: { flex: 1 },
  resultsQuery: { color: "#818cf8", fontSize: 13, fontWeight: "700" },
  resultsMeta: { color: "#334155", fontSize: 13 },
  newSearchBtn: {
    backgroundColor: "rgba(99,102,241,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.2)",
  },
  newSearchText: { color: "#818cf8", fontSize: 12, fontWeight: "600" },
  listContent: { paddingHorizontal: 8, paddingBottom: 30 },
  endText: {
    color: "#1e293b",
    textAlign: "center",
    fontSize: 12,
    marginVertical: 20,
    letterSpacing: 1,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { color: "#e2e8f0", fontSize: 20, fontWeight: "700" },
  emptySubtitle: {
    color: "#334155",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 16,
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
