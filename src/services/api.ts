import axios from 'axios';

const API_KEY = 'KiLIIkB5d706Y5AZcwCht16fnYsrWRq0RYTswjw16bVkA3I3uXTNZOe1';

/**
 * Fetches 4K wallpapers from Pexels.
 * @param query - The search term (e.g., 'Nature', 'Cyberpunk').
 * @param page - Current page for infinite scroll pagination.
 * @param isRandom - If true, fetches a random page to ensure fresh content on refresh.
 */
export const fetchWallpapers = async (query = 'nature', page = 1, isRandom = false) => {
  try {
    // 1. Pick a random page (1-100) if isRandom is true to show new photos on refresh
    const pageToFetch = isRandom ? Math.floor(Math.random() * 100) + 1 : page;
    
    const response = await axios.get(
      `https://api.pexels.com/v1/search?query=${query}&per_page=30&page=${pageToFetch}`, 
      { headers: { Authorization: API_KEY } }
    );
    
    return response.data.photos.map((photo: any) => ({
      id: photo.id.toString(),
      // 2. 'original' provides 4K+ resolution for the detail view
      url: photo.src.original, 
      // 3. 'medium' keeps the home screen grid scrolling fast
      thumbnail: photo.src.medium, 
      category: query,
    }));
  } catch (error) {
    console.error("Pexels API Fetch Error:", error);
    return [];
  }
};