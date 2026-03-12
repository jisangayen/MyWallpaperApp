import React from "react";
import { StyleSheet, View } from "react-native";

interface DotIndicatorProps {
  total: number;
  currentIndex: number;
}

export const DotIndicator = ({ total, currentIndex }: DotIndicatorProps) => {
  if (total <= 1) return null;

  const start = Math.max(0, currentIndex - 2);
  const end = Math.min(total, currentIndex + 3);

  return (
    <View style={styles.row} pointerEvents="none">
      {Array.from({ length: end - start }, (_, i) => {
        const realIndex = start + i;
        return (
          <View
            key={realIndex}
            style={[styles.dot, realIndex === currentIndex && styles.dotActive]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    position: "absolute",
    bottom: 130,
    alignSelf: "center",
    flexDirection: "row",
    gap: 5,
    zIndex: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dotActive: { backgroundColor: "#818cf8", width: 18, borderRadius: 3 },
});
