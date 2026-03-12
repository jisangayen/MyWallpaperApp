declare module "react-native-manage-wallpaper" {
  export const TYPE: {
    HOME: number;
    LOCK: number;
    BOTH: number;
  };

  interface WallpaperSource {
    uri: string;
  }

  interface WallpaperResponse {
    url?: string;
    error?: string;
  }

  const ManageWallpaper: {
    setWallpaper: (
      source: WallpaperSource,
      callback: (res: WallpaperResponse) => void,
      type: number,
    ) => void;
  };

  export default ManageWallpaper;
}
