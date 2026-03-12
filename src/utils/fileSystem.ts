import * as FileSystem from "expo-file-system/legacy";

/** Download a remote image to the local cache and return its local URI. */
export async function downloadToCache(remoteUri: string): Promise<string> {
  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) throw new Error("Cache directory is unavailable.");

  const localPath = `${cacheDir}wallpaper_${Date.now()}.jpg`;
  const result = await FileSystem.downloadAsync(remoteUri, localPath);

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Download failed — HTTP ${result.status}`);
  }

  return result.uri;
}

/** Delete a local file, swallowing any errors. */
export async function safeDelete(localUri: string) {
  try {
    await FileSystem.deleteAsync(localUri, { idempotent: true });
  } catch {
    // ignore
  }
}
