import { WallpaperCard } from "@/src/components/WallpaperCard";
import { fetchWallpapers } from "@/src/services/api";
import { useWallpaperStore } from "@/src/store/wallpaperStore";
import { navigateToDetails } from "@/src/utils/navigateToDetails";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, SlidersHorizontal } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WallpaperItem {
  id: string;
  url: string;
  downloadUrl?: string;
  thumbnail?: string;
  photographer?: string;
  alt?: string;
  category?: string;
}

export default function CategoryScreen() {
  const { query, name } = useLocalSearchParams<{
    query: string;
    name: string;
  }>();
  const router = useRouter();

  const setCategoryResults = useWallpaperStore((s) => s.setSearchResults);

  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadInitial();
  }, [query]);

  const loadInitial = async () => {
    setLoading(true);
    setPage(1);
    setHasMore(true);
    try {
      const data = await fetchWallpapers(query, 1);
      setWallpapers(data ?? []);
      setCategoryResults(data ?? []); // ✅ save to store with source="search"

      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 60,
          friction: 10,
        }),
      ]).start();
    } catch (e) {
      console.error("Category load error", e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setIsMoreLoading(true);
    try {
      const nextPage = page + 1;
      const newData = await fetchWallpapers(query, nextPage);
      if (newData?.length) {
        setWallpapers((prev) => {
          const ids = new Set(prev.map((r) => r.id));
          const merged = [
            ...prev,
            ...newData.filter((d: WallpaperItem) => !ids.has(d.id)),
          ];
          setCategoryResults(merged); // ✅ keep store in sync
          return merged;
        });
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
  }, [query, page, hasMore]);

  const handleImagePress = useCallback(
    (item: WallpaperItem) => {
      navigateToDetails(router, item, "search"); // ✅ passes full image data
    },
    [router],
  );

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.8}
        >
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>{name}</Text>
          {!loading && (
            <Text style={styles.subtitle}>{wallpapers.length}+ wallpapers</Text>
          )}
        </View>

        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
          <SlidersHorizontal color="#818cf8" size={20} />
        </TouchableOpacity>
      </View>

      {/* ── Loading ── */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading {name}...</Text>
        </View>
      ) : (
        <Animated.View
          style={[
            { flex: 1 },
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <FlashList
            data={wallpapers}
            numColumns={2}
            estimatedItemSize={280}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={
              isMoreLoading ? (
                <ActivityIndicator color="#6366f1" style={{ margin: 20 }} />
              ) : !hasMore && wallpapers.length > 0 ? (
                <Text style={styles.endText}>✦ You've seen it all ✦</Text>
              ) : null
            }
            renderItem={({ item, index }) => (
              <WallpaperCard
                imageUrl={item.thumbnail || item.url}
                itemId={item.id}
                index={index}
                onPress={() => handleImagePress(item)}
              />
            )}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030712" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
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
  headerCenter: { flex: 1 },
  title: {
    color: "#f1f5f9",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(99,102,241,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.2)",
  },

  // List
  listContent: { paddingHorizontal: 8, paddingBottom: 40, paddingTop: 8 },
  endText: {
    color: "#1e293b",
    textAlign: "center",
    fontSize: 12,
    marginVertical: 20,
    letterSpacing: 1,
  },

  // Loader
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  loadingText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "500",
  },
});
