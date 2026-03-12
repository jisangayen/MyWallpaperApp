import { GenreSlider } from "@/src/components/GenreSlider";
import { AnimatedTopHeader } from "@/src/components/Universal/AnimatedTopHeader";
import { Footer } from "@/src/components/Universal/Footer";
import { MainFooter } from "@/src/components/Universal/MainFooter";
import { NarowHeader } from "@/src/components/Universal/NarrowHeader";
import { WallpaperCard } from "@/src/components/WallpaperCard";
import { CATEGORIES } from "@/src/data/wallpapers";
import { fetchWallpapers } from "@/src/services/api";
import { useWallpaperStore } from "@/src/store/wallpaperStore";
import { navigateToDetails } from "@/src/utils/navigateToDetails";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();

  const wallpapers = useWallpaperStore((state) => state.wallpapers);
  const setWallpapers = useWallpaperStore((state) => state.setWallpapers);
  const appendWallpapers = useWallpaperStore((state) => state.appendWallpapers);

  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const footerRef = useRef<any>(null);
  const topHeaderRef = useRef<any>(null);
  const filterBarRef = useRef<any>(null);
  const scrollOffset = useRef(0);
  const isHidden = useRef(false);
  const loadingRef = useRef(false);
  const activeCategoryRef = useRef(activeCategory);

  // ✅ Keep ref in sync with state for use inside PanResponder
  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  // ✅ PanResponder — detects left/right swipe anywhere on screen
  const panResponder = useRef(
    PanResponder.create({
      // Only capture horizontal swipes
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 20 && Math.abs(dx) > Math.abs(dy) * 2;
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        const currentCategory = activeCategoryRef.current;
        const currentIndex = CATEGORIES.indexOf(currentCategory);

        if (dx < -50) {
          // ✅ Swipe LEFT → next category
          const nextIndex = Math.min(currentIndex + 1, CATEGORIES.length - 1);
          if (nextIndex !== currentIndex) {
            setActiveCategory(CATEGORIES[nextIndex]);
            filterBarRef.current?.scrollToCategory(CATEGORIES[nextIndex]);
          }
        } else if (dx > 50) {
          // ✅ Swipe RIGHT → previous category
          const prevIndex = Math.max(currentIndex - 1, 0);
          if (prevIndex !== currentIndex) {
            setActiveCategory(CATEGORIES[prevIndex]);
            filterBarRef.current?.scrollToCategory(CATEGORIES[prevIndex]);
          }
        }
      },
    }),
  ).current;

  const loadInitialData = useCallback(
    async (category: string) => {
      setIsLoading(true);
      setHasMore(true);
      setPage(1);
      try {
        const data = await fetchWallpapers(category, 1);
        setWallpapers(data ?? []);
      } catch (error) {
        console.error("Initial load error", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setWallpapers],
  );

  useEffect(() => {
    loadInitialData(activeCategory);
  }, [activeCategory, loadInitialData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    try {
      const data = await fetchWallpapers(activeCategory, 1);
      if (data?.length) {
        setWallpapers(data);
        setPage(1);
      }
    } catch (error) {
      console.error("Refresh error", error);
    } finally {
      setRefreshing(false);
    }
  }, [activeCategory, setWallpapers]);

  const loadMoreData = useCallback(async () => {
    if (loadingRef.current || isLoading || refreshing || !hasMore) return;
    loadingRef.current = true;
    setIsMoreLoading(true);
    try {
      const nextPage = page + 1;
      const newData = await fetchWallpapers(activeCategory, nextPage);
      if (newData?.length) {
        appendWallpapers(newData);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Pagination error", error);
    } finally {
      setIsMoreLoading(false);
      loadingRef.current = false;
    }
  }, [activeCategory, page, isLoading, refreshing, hasMore, appendWallpapers]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffset = event.nativeEvent.contentOffset.y;
      if (currentOffset <= 0) {
        if (isHidden.current) {
          topHeaderRef.current?.show();
          footerRef.current?.show();
          isHidden.current = false;
        }
        scrollOffset.current = 0;
        return;
      }
      const delta = currentOffset - scrollOffset.current;
      if (delta > 20 && !isHidden.current && currentOffset > 120) {
        topHeaderRef.current?.hide();
        footerRef.current?.hide();
        isHidden.current = true;
      } else if (delta < -20 && isHidden.current) {
        topHeaderRef.current?.show();
        footerRef.current?.show();
        isHidden.current = false;
      }
      scrollOffset.current = currentOffset;
    },
    [],
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      if (category === activeCategory) return;
      setActiveCategory(category);
      filterBarRef.current?.scrollToCategory(category);
    },
    [activeCategory],
  );

  return (
    // ✅ Attach PanResponder to the root view
    <View style={styles.container} {...panResponder.panHandlers}>
      <NarowHeader />
      <AnimatedTopHeader
        ref={topHeaderRef}
        filterBarRef={filterBarRef}
        activeCategory={activeCategory}
        onSelectCategory={handleCategoryChange}
      />

      {isLoading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlashList
          data={wallpapers}
          numColumns={2}
          estimatedItemSize={280}
          keyExtractor={(item) => item.id.toString()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6366f1"
              colors={["#6366f1"]}
              progressViewOffset={180}
            />
          }
          ListHeaderComponent={
            <GenreSlider onSelectGenre={handleCategoryChange} />
          }
          ListFooterComponent={
            isMoreLoading ? (
              <ActivityIndicator
                size="small"
                color="#6366f1"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
          renderItem={({ item, index }) => (
            <WallpaperCard
              imageUrl={item.thumbnail || item.url}
              itemId={item.id}
              index={index}
              onPress={() => navigateToDetails(router, item, "home")}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <MainFooter ref={footerRef} />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { paddingTop: 120, paddingBottom: 100, paddingHorizontal: 5 },
});
