import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  ChevronRight,
  Crown,
  Download,
  Heart,
  Info,
  Moon,
  Share2,
  Shield,
  Sparkles,
  Star,
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* ── Hero Banner ── */}
      <View style={styles.heroBanner}>
        <LinearGradient
          colors={["#1e1b4b", "#0f172a", "#020617"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Decorative circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <Animated.View
          style={[
            styles.heroContent,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Avatar */}
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={["#E23661", "#7c3aed"]}
              style={styles.avatarGradient}
            >
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
                }}
                style={styles.avatar}
              />
            </LinearGradient>
            <View style={styles.onlineDot} />
          </View>

          {/* Name & badge */}
          <View style={styles.nameBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>John</Text>
              <View style={styles.crownBadge}>
                <Crown color="#fbbf24" size={11} fill="#fbbf24" />
                <Text style={styles.crownText}>PRO</Text>
              </View>
            </View>
            <Text style={styles.userHandle}>@john • Elite Member</Text>
          </View>

          {/* Edit button */}
          <TouchableOpacity style={styles.editBtn}>
            <Sparkles color="#E23661" size={16} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ── Stats Row ── */}
      <Animated.View
        style={[
          styles.statsRow,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <StatCard
          icon={<Heart color="#f43f5e" size={18} fill="#f43f5e" />}
          count="85"
          label="Liked"
          accent="#f43f5e"
        />
        <View style={styles.statDivider} />
        <StatCard
          icon={<Download color="#6366f1" size={18} />}
          count="1.2k"
          label="Saved"
          accent="#6366f1"
        />
      </Animated.View>

      {/* ── Pro Banner ── */}
      <TouchableOpacity activeOpacity={0.85} style={styles.proBanner}>
        <LinearGradient
          colors={["#E23661", "#7c3aed"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.proGradient}
        >
          <View style={styles.proLeft}>
            <Crown color="#fff" size={20} fill="#fff" />
            <View>
              <Text style={styles.proTitle}>Upgrade to Pro</Text>
              <Text style={styles.proSub}>Unlock 4K downloads & more</Text>
            </View>
          </View>
          <ChevronRight color="#fff" size={18} />
        </LinearGradient>
      </TouchableOpacity>

      {/* ── Menu Sections ── */}
      <MenuSection
        title="PREFERENCES"
        items={[
          {
            icon: <Moon color="#818cf8" size={17} />,
            label: "Theme",
            accent: "#818cf8",
          },
          {
            icon: <Bell color="#06b6d4" size={17} />,
            label: "Notifications",
            accent: "#06b6d4",
          },
        ]}
      />

      <MenuSection
        title="COMMUNITY"
        items={[
          {
            icon: <Share2 color="#22c55e" size={17} />,
            label: "Share App",
            accent: "#22c55e",
          },
          {
            icon: <Star color="#fbbf24" size={17} />,
            label: "Rate App",
            accent: "#fbbf24",
          },
        ]}
      />

      <MenuSection
        title="LEGAL"
        items={[
          {
            icon: <Shield color="#f472b6" size={17} />,
            label: "Privacy Policy",
            accent: "#f472b6",
          },
          {
            icon: <Info color="#94a3b8" size={17} />,
            label: "About",
            accent: "#94a3b8",
          },
        ]}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>ID: 8829-UX-2026</Text>
        <View style={styles.footerDot} />
        <Text style={styles.footerText}>v4.0.2</Text>
      </View>
    </ScrollView>
  );
}

// ── Sub-components ──

const StatCard = ({ icon, count, label, accent }: any) => (
  <View style={styles.statCard}>
    {icon}
    <Text style={[styles.statCount, { color: accent }]}>{count}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const MenuSection = ({ title, items }: { title: string; items: any[] }) => (
  <View style={styles.menuSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.menuGroup}>
      {items.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.menuItem,
            i < items.length - 1 && styles.menuItemBorder,
          ]}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.menuIconBox,
              { backgroundColor: item.accent + "18" },
            ]}
          >
            {item.icon}
          </View>
          <Text style={styles.menuLabel}>{item.label}</Text>
          <ChevronRight
            color="#334155"
            size={14}
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  scrollContent: { paddingBottom: 120 },

  // Hero
  heroBanner: {
    height: 200,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#E23661",
    opacity: 0.07,
    top: -60,
    right: -60,
  },
  circle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#7c3aed",
    opacity: 0.1,
    top: 20,
    left: -40,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  avatarRing: { position: "relative" },
  avatarGradient: {
    width: 68,
    height: 68,
    borderRadius: 22,
    padding: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 63,
    height: 63,
    borderRadius: 20,
    backgroundColor: "#1e293b",
  },
  onlineDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22c55e",
    borderWidth: 2.5,
    borderColor: "#020617",
  },
  nameBlock: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  userName: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  crownBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#fbbf2420",
    borderWidth: 1,
    borderColor: "#fbbf2440",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  crownText: {
    color: "#fbbf24",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  userHandle: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#E2366115",
    borderWidth: 1,
    borderColor: "#E2366130",
    justifyContent: "center",
    alignItems: "center",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#0c1120",
    marginHorizontal: 16,
    borderRadius: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#1e293b",
    marginVertical: 4,
  },
  statCount: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  statLabel: {
    color: "#475569",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Pro banner
  proBanner: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  proGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  proLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  proTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  proSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 1,
  },

  // Menu
  menuSection: { marginBottom: 20, paddingHorizontal: 16 },
  sectionTitle: {
    color: "#334155",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: "#0c1120",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1e293b",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
  },
  footerText: { color: "#1e293b", fontSize: 11, fontWeight: "700" },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#1e293b",
  },
});
