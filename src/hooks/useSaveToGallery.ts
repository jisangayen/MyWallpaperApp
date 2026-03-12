import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { useCallback, useState } from "react";
import { Alert, Dimensions, PixelRatio } from "react-native";

interface UseSaveToGalleryOptions {
  onSuccess: (msg: string) => void;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("screen");
const PIXEL_RATIO = PixelRatio.get();

// Actual pixel dimensions of the device screen
const DEVICE_PX_W = Math.round(SCREEN_W * PIXEL_RATIO);
const DEVICE_PX_H = Math.round(SCREEN_H * PIXEL_RATIO);

/**
 * Builds a Pexels URL with exact device pixel dimensions.
 * Pexels supports ?w=&h= query params for server-side cropping.
 */
function buildFullScreenUrl(uri: string): string {
  try {
    const url = new URL(uri);
    // Only modify Pexels URLs
    if (
      !url.hostname.includes("pexels.com") &&
      !url.hostname.includes("images.pexels.com")
    ) {
      return uri;
    }
    // Remove any existing size params and set device exact dimensions
    url.searchParams.delete("w");
    url.searchParams.delete("h");
    url.searchParams.delete("fit");
    url.searchParams.set("w", DEVICE_PX_W.toString());
    url.searchParams.set("h", DEVICE_PX_H.toString());
    url.searchParams.set("fit", "crop"); // crop to fill, not letterbox
    url.searchParams.set("auto", "compress");
    return url.toString();
  } catch {
    return uri;
  }
}

export function useSaveToGallery({ onSuccess }: UseSaveToGalleryOptions) {
  const [isProcessing, setIsProcessing] = useState(false);

  const saveToGallery = useCallback(
    async (uri: string | undefined) => {
      if (!uri) return;

      setIsProcessing(true);

      try {
        // 1. Request permission
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please allow storage access to save wallpapers.",
            [{ text: "OK" }],
          );
          return;
        }

        // 2. Build URL cropped to exact device screen size
        const fullScreenUri = buildFullScreenUrl(uri);

        // 3. Download to cache
        const cacheDir = FileSystem.cacheDirectory;
        if (!cacheDir) throw new Error("Cache unavailable");

        const localPath = `${cacheDir}wallpaper_${Date.now()}.jpg`;
        const result = await FileSystem.downloadAsync(fullScreenUri, localPath);

        if (result.status < 200 || result.status >= 300) {
          throw new Error(`Download failed — HTTP ${result.status}`);
        }

        // 4. Save to gallery
        await MediaLibrary.createAssetAsync(result.uri);

        // 5. Clean up cache
        await FileSystem.deleteAsync(result.uri, { idempotent: true });

        onSuccess("Saved! Fits your screen perfectly ✅");
      } catch (err: any) {
        console.error("[Save] Error:", err);
        Alert.alert(
          "Save Failed",
          err?.message ?? "Something went wrong. Please try again.",
          [{ text: "OK" }],
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccess],
  );

  return { saveToGallery, isProcessing };
}
