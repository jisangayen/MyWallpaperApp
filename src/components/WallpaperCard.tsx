import { Image } from "expo-image";
import { Heart } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useWallpaperStore } from "../store/wallpaperStore";

interface WallpaperCardProps {
  imageUrl: string;
  index: number;
  itemId?: string; // optional so old usages don't break
  onPress: () => void;
}

export const WallpaperCard = React.memo(
  ({ imageUrl, itemId, onPress }: WallpaperCardProps) => {
    const favorites = useWallpaperStore((s) => s.favorites);
    const favoriteItems = useWallpaperStore((s) => s.favoriteItems);
    const toggleFavorite = useWallpaperStore((s) => s.toggleFavorite);

    const isFav = itemId ? favorites.includes(itemId) : false;

    const handleHeartPress = () => {
      if (!itemId) return;
      const existing = favoriteItems.find((f) => f.id === itemId);
      toggleFavorite(
        existing ?? { id: itemId, url: imageUrl, thumbnail: imageUrl },
      );
    };

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.6}
        onPress={onPress}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={300}
          placeholder="|rF?hV%2WCj[ayj[a|j[ayjtOGS7ObeZ8w8wOFaybjt7RjjtWpWpWlWp"
        />

        {itemId && (
          <TouchableOpacity
            style={[styles.heartBtn, isFav && styles.heartBtnActive]}
            onPress={handleHeartPress}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Heart
              size={16}
              color={isFav ? "#f43f5e" : "#fff"}
              fill={isFav ? "#f43f5e" : "transparent"}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    height: 280,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#0f172a",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  image: { width: "100%", height: "100%" },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  heartBtnActive: {
    backgroundColor: "rgba(244,63,94,0.2)",
    borderColor: "rgba(244,63,94,0.4)",
  },
});
