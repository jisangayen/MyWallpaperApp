import React from "react";
import { StyleSheet, View } from "react-native";

export const Header = ({ title }: { title: string }) => (
  <View style={styles.advancedHeader}>
    <View></View>
  </View>
);

const styles = StyleSheet.create({
  advancedHeader: {
    backgroundColor: "#0F172A", // Deep Slate/Navy
    paddingTop: 80,
  },
});
