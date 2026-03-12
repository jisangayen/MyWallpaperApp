import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "user_favorites";

export interface FavoriteItem {
  id: string;
  url: string;
  thumbnail?: string;
  photographer?: string;
  alt?: string;
  category?: string;
}

/** Get all saved favorites */
export async function getFavorites(): Promise<FavoriteItem[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save a wallpaper to favorites */
export async function addFavorite(item: FavoriteItem): Promise<void> {
  try {
    const current = await getFavorites();
    const already = current.find((f) => f.id === item.id);
    if (already) return;
    await AsyncStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify([...current, item]),
    );
  } catch (err) {
    console.error("[Favorites] addFavorite error:", err);
  }
}

/** Remove a wallpaper from favorites */
export async function removeFavorite(id: string): Promise<void> {
  try {
    const current = await getFavorites();
    const updated = current.filter((f) => f.id !== id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("[Favorites] removeFavorite error:", err);
  }
}

/** Check if a wallpaper is favorited */
export async function isFavorited(id: string): Promise<boolean> {
  const current = await getFavorites();
  return current.some((f) => f.id === id);
}
