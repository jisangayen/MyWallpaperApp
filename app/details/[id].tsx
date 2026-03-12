import BottomSheet from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";

import { ActionRow } from "@/src/components/components/ActionRow";
import { DotIndicator } from "@/src/components/components/DotIndicator";
import { ProgressOverlay } from "@/src/components/components/ProgressOverlay";
import { Toast } from "@/src/components/components/Toast";
import { TopNav } from "@/src/components/components/TopNav";
import { WallpaperBottomSheet } from "@/src/components/components/WallpaperBottomSheet";
import { useSaveToGallery } from "@/src/hooks/useSaveToGallery";
import { useSetWallpaper } from "@/src/hooks/useSetWallpaper";
import { useShareWallpaper } from "@/src/hooks/useShareWallpaper";
import { useToast } from "@/src/hooks/useToast";
import { useWallpaperStore } from "@/src/store/wallpaperStore";

const { width, height } = Dimensions.get("window");

export default function DetailsScreen() {
  const params = useLocalSearchParams<{
    id: string;
    source?: string;
    url?: string;
    thumbnail?: string;
    photographer?: string;
    alt?: string;
  }>();

  const { id, source, url, thumbnail, photographer, alt } = params;
  const router = useRouter();

  const homeWallpapers = useWallpaperStore((s) => s.wallpapers);
  const searchResults = useWallpaperStore((s) => s.searchResults);
  const favorites = useWallpaperStore((s) => s.favorites);
  const toggleFavorite = useWallpaperStore((s) => s.toggleFavorite);

  // ✅ Pick list based on source param
  const storeList = source === "search" ? searchResults : homeWallpapers;

  // ✅ Fallback: if store is empty or item not found, build a single-item list from params
  const wallpapers = useMemo(() => {
    const found = storeList.find((w) => w.id.toString() === id?.toString());
    if (found) return storeList;

    // Store not ready yet — use URL params directly as fallback
    if (url) {
      return [
        {
          id: id ?? "",
          url: decodeURIComponent(url),
          thumbnail: thumbnail ? decodeURIComponent(thumbnail) : undefined,
          photographer: photographer
            ? decodeURIComponent(photographer)
            : undefined,
          alt: alt ? decodeURIComponent(alt) : undefined,
        },
      ];
    }

    return storeList;
  }, [storeList, id, url, thumbnail, photographer, alt]);

  const initialIndex = useMemo(() => {
    const idx = wallpapers.findIndex((w) => w.id.toString() === id?.toString());
    return idx >= 0 ? idx : 0;
  }, [id, wallpapers]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isUIVisible, setIsUIVisible] = useState(true);

  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const currentItem = wallpapers[currentIndex];
  const isFav = favorites?.includes(currentItem?.id);

  const { toast, showToast } = useToast();
  const { saveToGallery, isProcessing: isSaving } = useSaveToGallery({
    onSuccess: showToast,
  });
  const {
    setWallpaper,
    isProcessing: isSettingWallpaper,
    processingLabel,
  } = useSetWallpaper({
    onSuccess: showToast,
    onFallbackSave: () => saveToGallery(currentItem?.url),
  });
  const { shareWallpaper } = useShareWallpaper();
  const isProcessing = isSaving || isSettingWallpaper;

  useEffect(() => {
    [1, 2, 3].forEach((offset) => {
      const next = wallpapers[currentIndex + offset];
      if (next?.url) Image.prefetch(next.url);
    });
  }, [currentIndex, wallpapers]);

  const handleToggleUI = useCallback(() => {
    if (isSheetOpen) {
      bottomSheetRef.current?.close();
      setIsSheetOpen(false);
    } else {
      setIsUIVisible((prev) => !prev);
    }
  }, [isSheetOpen]);

  const openSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
    setIsSheetOpen(true);
    setIsUIVisible(true);
  }, []);

  if (!currentItem) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#818cf8" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PagerView
          style={styles.pagerView}
          initialPage={initialIndex}
          onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
          offscreenPageLimit={2}
        >
          {wallpapers.map((item) => (
            <View key={item.id} style={styles.page}>
              <Pressable style={styles.page} onPress={handleToggleUI}>
                <Image
                  source={{ uri: item.thumbnail ?? item.url }}
                  contentFit="cover"
                  style={StyleSheet.absoluteFillObject}
                  blurRadius={8}
                  cachePolicy="memory-disk"
                />
                <Image
                  source={{ uri: item.url }}
                  contentFit="cover"
                  transition={{ duration: 300, effect: "cross-dissolve" }}
                  cachePolicy="memory-disk"
                  style={StyleSheet.absoluteFillObject}
                />
              </Pressable>
            </View>
          ))}
        </PagerView>

        <View style={styles.gradientTop} pointerEvents="none" />
        <View style={styles.gradientBottom} pointerEvents="none" />

        <ProgressOverlay visible={isProcessing} label={processingLabel} />
        <Toast
          message={toast.message}
          visible={!!toast.message}
          key={toast.key}
        />

        {isUIVisible && (
          <TopNav
            photographer={currentItem.photographer}
            alt={currentItem.alt}
            isFavorite={!!isFav}
            onBack={() => router.back()}
            onToggleFavorite={() => {
              toggleFavorite(currentItem);
              showToast(
                isFav ? "Removed from favorites" : "Added to favorites ❤️",
              );
            }}
          />
        )}

        {isUIVisible && !isSheetOpen && (
          <DotIndicator total={wallpapers.length} currentIndex={currentIndex} />
        )}

        {isUIVisible && !isSheetOpen && (
          <ActionRow
            onShare={() => shareWallpaper(currentItem.url)}
            onApply={openSheet}
            onSave={() =>
              saveToGallery(currentItem.downloadUrl ?? currentItem.url)
            }
          />
        )}

        <WallpaperBottomSheet
          bottomSheetRef={bottomSheetRef}
          onSetHome={() => setWallpaper(currentItem.url, "home")}
          onSetLock={() => setWallpaper(currentItem.url, "lock")}
          onSetBoth={() => setWallpaper(currentItem.url, "both")}
          onSaveToGallery={() =>
            saveToGallery(currentItem.downloadUrl ?? currentItem.url)
          }
          onShare={() => shareWallpaper(currentItem.url)}
          onClose={() => setIsSheetOpen(false)}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  pagerView: { flex: 1 },
  page: { width, height },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    opacity: 0.9,
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    opacity: 0.9,
  },
  fullImage: { width: "100%", height: "100%", position: "absolute" },
});
