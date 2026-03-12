import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const GENRES = [
  {
    id: "1",
    name: "Amoled",
    query: "dark amoled",
    accent: "#7c3aed",
    img: "https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "2",
    name: "Cyber",
    query: "cyberpunk",
    accent: "#06b6d4",
    img: "https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "3",
    name: "Minimal",
    query: "minimalist",
    accent: "#e2e8f0",
    img: "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "4",
    name: "Nature",
    query: "nature",
    accent: "#22c55e",
    img: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "5",
    name: "Anime",
    query: "anime art",
    accent: "#f472b6",
    img: "https://images.pexels.com/photos/13554030/pexels-photo-13554030.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "6",
    name: "Space",
    query: "galaxy space",
    accent: "#818cf8",
    img: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "7",
    name: "Cars",
    query: "supercar",
    accent: "#fb923c",
    img: "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const GenreCard = ({
  item,
  onPress,
}: {
  item: (typeof GENRES)[0];
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.93))}
      onPressOut={() => (scale.value = withSpring(1))}
    >
      <Animated.View style={[styles.card, animStyle]}>
        <Image
          source={{ uri: item.img }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.75)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.cardBottom}>
          <View style={[styles.dot, { backgroundColor: item.accent }]} />
          <Text style={styles.cardName}>{item.name}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export const GenreSlider = ({
  onSelectGenre,
}: {
  onSelectGenre?: (query: string) => void;
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Genres</Text>
      <FlatList
        horizontal
        data={GENRES}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GenreCard
            item={item}
            onPress={() =>
              onSelectGenre
                ? onSelectGenre(item.query)
                : router.push({
                    pathname: "/category/[query]",
                    params: { query: item.query, name: item.name },
                  })
            }
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    color: "#f1f5f9",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 14,
    gap: 8,
  },
  card: {
    width: 90,
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#0f172a",
    justifyContent: "flex-end",
  },
  cardBottom: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  cardName: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
