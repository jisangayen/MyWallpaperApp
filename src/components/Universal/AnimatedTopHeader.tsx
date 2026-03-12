import { FilterBar } from "@/src/components/FilterBar";
import { SearchBar } from "@/src/components/Search/SearchBar";
import React, { useImperativeHandle, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Header } from "./Header";

export const AnimatedTopHeader = React.forwardRef(
  ({ activeCategory, onSelectCategory, filterBarRef }: any, ref) => {
    const translateY = useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
      hide: () => {
        Animated.timing(translateY, {
          toValue: -200,
          duration: 300,
          useNativeDriver: true,
        }).start();
      },
      show: () => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      },
    }));

    return (
      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
      >
        <Header title="Wallpapers" />
        <SearchBar />
        {/* ✅ Pass filterBarRef so Home can call scrollToCategory on it */}
        <FilterBar
          ref={filterBarRef}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 100,
    backgroundColor: "#020617",
  },
});
