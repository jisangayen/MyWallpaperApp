import { CATEGORIES } from "@/src/data/wallpapers";
import React, { useImperativeHandle, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ACTIVE_COLOR = "#E23661";
const PRIMARY_COLOR = "#EC0868";
const SECONDARY_COLOR = "#AB2346";
const TAB_WIDTH = 80; // approximate width per tab for scroll calculation

interface FilterBarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const FilterBar = React.forwardRef(
  ({ activeCategory, onSelectCategory }: FilterBarProps, ref) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    useImperativeHandle(ref, () => ({
      hide: () => {
        Animated.timing(translateY, {
          toValue: -100,
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
      // ✅ Scroll the filter bar to show the active category
      scrollToCategory: (category: string) => {
        const index = CATEGORIES.indexOf(category);
        if (index >= 0 && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: Math.max(0, index * TAB_WIDTH - TAB_WIDTH),
            animated: true,
          });
        }
      },
    }));

    return (
      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => onSelectCategory(category)}
                style={styles.tab}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.categoryText, isActive && styles.activeText]}
                >
                  {category}
                </Text>

                {isActive && (
                  <View style={styles.activeIndicator}>
                    <View style={styles.line} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: "#020617",
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 25,
    alignItems: "center",
  },
  tab: {
    marginRight: 28,
    alignItems: "center",
    paddingBottom: 8,
  },
  categoryText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  activeText: {
    color: ACTIVE_COLOR,
    fontWeight: "900",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  line: {
    height: 3,
    width: 20,
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 2,
  },
});
