import { useCallback } from "react";
import { Alert, Platform, Share } from "react-native";

export function useShareWallpaper() {
  const shareWallpaper = useCallback(async (url: string | undefined) => {
    if (!url) return;
    try {
      await Share.share(
        Platform.OS === "ios"
          ? { url, message: "Check out this wallpaper!" }
          : { message: `Check out this wallpaper! ${url}` },
      );
    } catch (err: any) {
      if (err?.message !== "User did not share") {
        Alert.alert("Share Failed", err?.message ?? "Could not share.");
      }
    }
  }, []);

  return { shareWallpaper };
}
