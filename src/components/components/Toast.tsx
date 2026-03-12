import { Check } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface ToastProps {
  message: string;
  visible: boolean;
}

export const Toast = ({ message, visible }: ToastProps) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.delay(1600),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, message]);

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <View style={styles.inner}>
        <Check color="#4ade80" size={16} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
    zIndex: 1000,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(15,23,42,0.92)",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.3)",
  },
  text: { color: "#f1f5f9", fontSize: 14, fontWeight: "600" },
});
