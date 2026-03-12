import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import ManageWallpaper, { TYPE } from "react-native-manage-wallpaper";

type WallpaperTarget = "home" | "lock" | "both";

interface UseSetWallpaperOptions {
  onSuccess: (msg: string) => void;
  onFallbackSave: () => void;
}

const LABEL_MAP: Record<WallpaperTarget, string> = {
  home: "Setting Home Screen…",
  lock: "Setting Lock Screen…",
  both: "Setting Both Screens…",
};

// ✅ Use TYPE from the library directly
const TYPE_MAP: Record<WallpaperTarget, number> = {
  home: TYPE.HOME,
  lock: TYPE.LOCK,
  both: TYPE.BOTH,
};

export function useSetWallpaper({
  onSuccess,
  onFallbackSave,
}: UseSetWallpaperOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState("");

  const setWallpaper = useCallback(
    async (uri: string | undefined, target: WallpaperTarget) => {
      if (!uri || typeof uri !== "string") return;

      if (Platform.OS === "ios") {
        Alert.alert(
          "Set Wallpaper on iPhone",
          "iOS doesn't allow apps to set wallpapers directly.\n\nSave it to your Photos, then open Photos and set it from there.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Save to Photos", onPress: onFallbackSave },
          ],
        );
        return;
      }

      setProcessingLabel(LABEL_MAP[target]);
      setIsProcessing(true);

      try {
        const wallType = TYPE_MAP[target];

        await new Promise<void>((resolve, reject) => {
          // ✅ Correct argument order:
          // arg 0: { uri: string }  — image URI (remote URL works directly)
          // arg 1: callback         — response handler
          // arg 2: TYPE             — home / lock / both
          ManageWallpaper.setWallpaper(
            { uri },
            (res: any) => {
              console.log("[Wallpaper] Response:", JSON.stringify(res));
              if (res?.error) reject(new Error(res.error));
              else resolve();
            },
            wallType,
          );
        });

        onSuccess("Wallpaper applied! ✨");
      } catch (err: any) {
        console.error("[SetWallpaper] Error:", err);
        Alert.alert(
          "Failed to Set Wallpaper",
          err?.message ?? "Could not apply wallpaper. Please try again.",
          [
            { text: "OK" },
            { text: "Save to Gallery", onPress: onFallbackSave },
          ],
        );
      } finally {
        setIsProcessing(false);
        setProcessingLabel("");
      }
    },
    [onSuccess, onFallbackSave],
  );

  return { setWallpaper, isProcessing, processingLabel };
}
