import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  Box,
  Lock,
  Monitor,
  Save,
  Share2,
  Smartphone,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WallpaperBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onSetHome: () => void;
  onSetLock: () => void;
  onSetBoth: () => void;
  onSaveToGallery: () => void;
  onShare: () => void;
  onClose: () => void;
}

interface OptionItemProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  last?: boolean;
  onPress?: () => void;
}

const OptionItem = ({
  icon,
  label,
  sublabel,
  last,
  onPress,
}: OptionItemProps) => (
  <TouchableOpacity
    style={[styles.optionItem, last && { borderBottomWidth: 0 }]}
    activeOpacity={0.65}
    onPress={onPress}
  >
    <View style={styles.optionIconWrap}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={styles.optionLabel}>{label}</Text>
      {sublabel ? <Text style={styles.optionSublabel}>{sublabel}</Text> : null}
    </View>
  </TouchableOpacity>
);

export const WallpaperBottomSheet = ({
  bottomSheetRef,
  onSetHome,
  onSetLock,
  onSetBoth,
  onSaveToGallery,
  onShare,
  onClose,
}: WallpaperBottomSheetProps) => {
  const snapPoints = useMemo(() => ["65%"], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.sheetHandle}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>Apply Wallpaper</Text>
        <Text style={styles.subtitle}>Choose where to set this wallpaper</Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridCard}
            activeOpacity={0.7}
            onPress={onSetHome}
          >
            <View style={styles.gridIcon}>
              <Monitor color="#818cf8" size={28} />
            </View>
            <Text style={styles.gridLabel}>Home Screen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            activeOpacity={0.7}
            onPress={onSetLock}
          >
            <View style={styles.gridIcon}>
              <Lock color="#818cf8" size={28} />
            </View>
            <Text style={styles.gridLabel}>Lock Screen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            activeOpacity={0.7}
            onPress={onSetBoth}
          >
            <View style={styles.gridIcon}>
              <Smartphone color="#818cf8" size={28} />
            </View>
            <Text style={styles.gridLabel}>Both Screens</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <OptionItem
          icon={<Save color="#818cf8" size={22} />}
          label="Save to Gallery"
          sublabel="Download full resolution to Photos"
          onPress={onSaveToGallery}
        />
        <OptionItem
          icon={<Share2 color="#818cf8" size={22} />}
          label="Share Wallpaper"
          sublabel="Send link or image to others"
          onPress={onShare}
        />
        <OptionItem
          icon={<Box color="#818cf8" size={22} />}
          label="Make 3D Parallax"
          sublabel="Coming soon"
          last
          onPress={() =>
            Alert.alert("Coming Soon", "3D parallax effect is in development!")
          }
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: "#080f1f" },
  sheetHandle: { backgroundColor: "#1e293b", width: 40 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  title: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  grid: { flexDirection: "row", gap: 10, marginBottom: 8 },
  gridCard: {
    flex: 1,
    backgroundColor: "rgba(99,102,241,0.08)",
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.2)",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    gap: 10,
  },
  gridIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(129,140,248,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  gridLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  divider: { height: 1, backgroundColor: "#1e293b", marginVertical: 16 },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#0f1a2e",
    gap: 14,
  },
  optionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "rgba(129,140,248,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionLabel: { color: "#e2e8f0", fontSize: 15, fontWeight: "600" },
  optionSublabel: { color: "#475569", fontSize: 12, marginTop: 2 },
});
