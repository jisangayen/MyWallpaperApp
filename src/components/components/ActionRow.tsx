import { COLORS } from "@/src/constants/Colors";
import { Download, Save, Share2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionRowProps {
  onShare: () => void;
  onApply: () => void;
  onSave: () => void;
}

export const ActionRow = ({ onShare, onApply, onSave }: ActionRowProps) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.pillBtn}
      onPress={onShare}
      activeOpacity={0.75}
    >
      <Share2 color="#fff" size={20} />
      <Text style={styles.pillBtnText}>Share</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.applyBtn}
      onPress={onApply}
      activeOpacity={0.85}
    >
      <Download color="#fff" size={24} />
      <Text style={styles.applyBtnText}>Apply</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.pillBtn}
      onPress={onSave}
      activeOpacity={0.75}
    >
      <Save color="#fff" size={20} />
      <Text style={styles.pillBtnText}>Save</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 44,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    zIndex: 10,
  },
  pillBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingVertical: 13,
    borderRadius: 8,
  },
  pillBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  applyBtn: {
    flex: 1.6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.active,
    paddingVertical: 15,
    borderRadius: 6,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  applyBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
