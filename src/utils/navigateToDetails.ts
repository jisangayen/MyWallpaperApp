// ✅ Use this helper everywhere you navigate to details
// It passes full image data as params so details page NEVER shows wrong image

import { Router } from "expo-router";

interface WallpaperItem {
  id: string;
  url: string;
  thumbnail?: string;
  photographer?: string;
  alt?: string;
  downloadUrl?: string;
}

export function navigateToDetails(
  router: Router,
  item: WallpaperItem,
  source: "home" | "search" = "home",
) {
  router.push({
    pathname: "/details/[id]",
    params: {
      id: item.id,
      source,
      url: encodeURIComponent(item.url),
      thumbnail: encodeURIComponent(item.thumbnail ?? item.url),
      photographer: encodeURIComponent(item.photographer ?? ""),
      alt: encodeURIComponent(item.alt ?? ""),
    },
  });
}
