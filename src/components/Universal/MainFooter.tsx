import { usePathname, useRouter } from "expo-router";
import { Bookmark, Compass, Home, Sparkles, User } from "lucide-react-native";
import React, { useImperativeHandle, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
// const PRIMARY_COLOR = "#D64045"; // jisan
const ACTIVE_COLOR = "#E23661";
const PRIMARY_COLOR = "#EC0868";
const SECONDARY_COLOR = "#AB2346";

// We use forwardRef to allow the Home screen to call show/hide functions
export const MainFooter = React.forwardRef((props, ref) => {
  const router = useRouter();
  const pathname = usePathname();

  // 1. Animation Value (0 is visible, 100 is hidden below screen)
  const scrollAnim = useRef(new Animated.Value(0)).current;

  // 2. Expose show/hide functions to the parent component
  useImperativeHandle(ref, () => ({
    hide: () => {
      Animated.timing(scrollAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    show: () => {
      Animated.timing(scrollAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
  }));

  const isActive = (path: string) => pathname === path;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: scrollAnim }] }, // 3. Link animation to position
      ]}
    >
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.tabItem}
        >
          <Home
            color={isActive("/") ? ACTIVE_COLOR : SECONDARY_COLOR}
            size={24}
          />
          {isActive("/") && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/discover")}
          style={styles.tabItem}
        >
          <Compass
            color={isActive("/discover") ? ACTIVE_COLOR : SECONDARY_COLOR}
            size={24}
          />
          {isActive("/discover") && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <View style={styles.centerButtonContainer}>
          <TouchableOpacity
            style={styles.aiButton}
            activeOpacity={0.8}
            onPress={() => router.push("/search")}
          >
            <Sparkles color="#fff" size={28} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/favorites")}
          style={styles.tabItem}
        >
          <Bookmark
            color={isActive("/favorites") ? ACTIVE_COLOR : SECONDARY_COLOR}
            size={24}
          />
          {isActive("/favorites") && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={styles.tabItem}
        >
          <User
            color={isActive("/profile") ? ACTIVE_COLOR : SECONDARY_COLOR}
            size={24}
          />
          {isActive("/profile") && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "transparent",
    zIndex: 100,
  },
  tabBar: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: "100%",
  },
  centerButtonContainer: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  aiButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#6366f1",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    borderWidth: 4,
    borderColor: "#020617",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACTIVE_COLOR,
    marginTop: 4,
  },
});
