import { Dimensions, NativeModules } from "react-native";

export const WALLPAPER_TYPE = { HOME: 1, LOCK: 2, BOTH: 3 } as const;

export const { width, height } = Dimensions.get("window");

export const WallpaperModule: any =
  NativeModules?.ManageWallpaper ??
  NativeModules?.RNManageWallpaper ??
  NativeModules?.WallpaperManager ??
  null;

if (__DEV__ && !WallpaperModule) {
  console.warn(
    "[Wallpaper] Native module not found. Available modules:",
    Object.keys(NativeModules).join(", "),
  );
}
