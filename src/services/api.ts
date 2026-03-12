import axios from "axios";

const API_KEY = "54985103-59cdeafde4a68333013a89e87";
const BASE_URL = "https://pixabay.com/api/";

// ✅ Relaxed ratio — accepts more portrait images
function isPortrait(image: any): boolean {
  const { imageWidth, imageHeight } = image;
  if (!imageWidth || !imageHeight) return true; // include if no dimensions
  return imageHeight >= imageWidth; // any image taller than wide
}

export const fetchWallpapers = async (
  query = "nature",
  page = 1,
  isRandom = false,
) => {
  try {
    const perPage = 50; // ✅ fetch 50, filter down to ~30+
    const pageToFetch = isRandom ? Math.floor(Math.random() * 5) + 1 : page;

    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "vertical", // ✅ Pixabay pre-filters vertical
        per_page: perPage,
        page: pageToFetch,
        safesearch: true,
        order: "popular",
        // ✅ Removed min_width/min_height — they cut results too much
      },
    });

    const hits = response.data.hits;

    if (!hits || hits.length === 0) {
      console.warn("[Pixabay] No results for:", query, "page:", pageToFetch);
      return [];
    }

    const filtered = hits.filter(isPortrait);
    console.log(
      `[Pixabay] Fetched ${hits.length}, after filter: ${filtered.length}`,
    );

    return filtered.map((image: any) => ({
      id: image.id.toString(),
      url: image.largeImageURL, // ✅ display URL (hotlink allowed)
      downloadUrl: image.largeImageURL, // ✅ full res for saving
      thumbnail: image.largeImageURL, // ✅ fast loading thumbnail
      category: query,
      photographer: image.user,
      alt: image.tags,
      width: image.imageWidth,
      height: image.imageHeight,
    }));
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.error("[Pixabay] Rate Limit Reached — wait before retrying");
    } else if (error.response?.status === 400) {
      console.error("[Pixabay] Bad Request:", error.response?.data);
    } else {
      console.error("[Pixabay] API Fetch Error:", error.message);
    }
    return [];
  }
};
