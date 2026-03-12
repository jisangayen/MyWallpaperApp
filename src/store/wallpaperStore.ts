import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const FAVORITES_KEY = "user_favorites";

interface Wallpaper {
  id: string;
  url: string;
  downloadUrl?: string;
  thumbnail?: string;
  photographer?: string;
  alt?: string;
  category?: string;
}

interface WallpaperState {
  wallpapers: Wallpaper[]; // home feed
  searchResults: Wallpaper[]; // search results
  activeList: "home" | "search"; // which list details page reads from
  favorites: string[];
  favoriteItems: Wallpaper[];

  setWallpapers: (data: Wallpaper[]) => void;
  appendWallpapers: (data: Wallpaper[]) => void;
  setSearchResults: (data: Wallpaper[]) => void;
  appendSearchResults: (data: Wallpaper[]) => void;
  setActiveList: (list: "home" | "search") => void;
  toggleFavorite: (item: Wallpaper) => Promise<void>;
  loadFavorites: () => Promise<void>;
}

export const useWallpaperStore = create<WallpaperState>((set, get) => ({
  wallpapers: [],
  searchResults: [],
  activeList: "home",
  favorites: [],
  favoriteItems: [],

  setWallpapers: (data) => set({ wallpapers: data }),

  appendWallpapers: (data) =>
    set((state) => {
      const map = new Map();
      [...state.wallpapers, ...data].forEach((item) => map.set(item.id, item));
      return { wallpapers: Array.from(map.values()) };
    }),

  // ✅ Set search results and switch active list to search
  setSearchResults: (data) =>
    set({ searchResults: data, activeList: "search" }),

  // ✅ Append more search results (pagination)
  appendSearchResults: (data) =>
    set((state) => {
      const map = new Map();
      [...state.searchResults, ...data].forEach((item) =>
        map.set(item.id, item),
      );
      return { searchResults: Array.from(map.values()) };
    }),

  // ✅ Switch which list the details page reads from
  setActiveList: (list) => set({ activeList: list }),

  loadFavorites: async () => {
    try {
      const raw = await AsyncStorage.getItem(FAVORITES_KEY);
      const items: Wallpaper[] = raw ? JSON.parse(raw) : [];
      set({ favoriteItems: items, favorites: items.map((i) => i.id) });
    } catch (err) {
      console.error("[Store] loadFavorites error:", err);
    }
  },

  toggleFavorite: async (item: Wallpaper) => {
    const { favorites, favoriteItems } = get();
    const isAlreadyFav = favorites.includes(item.id);
    const updatedItems = isAlreadyFav
      ? favoriteItems.filter((f) => f.id !== item.id)
      : [...favoriteItems, item];

    set({
      favoriteItems: updatedItems,
      favorites: updatedItems.map((i) => i.id),
    });

    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedItems));
    } catch (err) {
      console.error("[Store] toggleFavorite persist error:", err);
    }
  },
}));
