import { ArrowLeft, Heart } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TopNavProps {
  photographer?: string;
  alt?: string;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
}

export const TopNav = ({
  photographer,
  alt,
  isFavorite,
  onBack,
  onToggleFavorite,
}: TopNavProps) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
      <ArrowLeft color="#fff" size={22} />
    </TouchableOpacity>

    <View style={styles.creatorPill}>
      <Text style={styles.name} numberOfLines={1}>
        {photographer ?? "Premium Artist"}
      </Text>
      <Text style={styles.sub} numberOfLines={1}>
        {alt ?? "4K Wallpaper"}
      </Text>
    </View>

    <TouchableOpacity
      style={[styles.iconBtn, isFavorite && styles.iconBtnActive]}
      onPress={onToggleFavorite}
    >
      <Heart
        color={isFavorite ? "#f43f5e" : "#fff"}
        fill={isFavorite ? "#f43f5e" : "transparent"}
        size={22}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 56,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    gap: 10,
  },
  iconBtn: {
    backgroundColor: "rgba(0,0,0,0.45)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  iconBtnActive: {
    backgroundColor: "rgba(244,63,94,0.2)",
    borderColor: "rgba(244,63,94,0.4)",
  },
  creatorPill: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  name: { color: "#fff", fontWeight: "700", fontSize: 15, letterSpacing: 0.2 },
  sub: { color: "#94a3b8", fontSize: 12, marginTop: 1 },
});
