import { MainFooter } from "@/src/components/Universal/MainFooter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// ✅ Add any routes where footer should be hidden
const HIDDEN_FOOTER_ROUTES = [
  "/details", // image details page
  "/category", // category page (optional)
];

export default function RootLayout() {
  const pathname = usePathname();

  // ✅ Hide footer if current path starts with any hidden route
  const showFooter = !HIDDEN_FOOTER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }} />

          {/* ✅ Only show footer on allowed screens */}
          {showFooter && <MainFooter />}
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
});
