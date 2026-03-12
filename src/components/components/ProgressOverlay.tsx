import { COLORS } from "@/src/constants/Colors";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface ProgressOverlayProps {
  visible: boolean;
  label: string;
}

export const ProgressOverlay = ({ visible, label }: ProgressOverlayProps) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#818cf8" />
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2176FF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  card: {
    backgroundColor: "#2176FF",
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 32,
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(129,140,248,0.25)",
  },
  label: {
    color: COLORS.active,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
