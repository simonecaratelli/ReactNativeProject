import AsyncStorage from "@react-native-async-storage/async-storage";

export const FAVORITES_KEY = "app:v1:favs";
export const USER_KEY = "app:v1:user";

function getFavoritesKeyForUser(username: string | null): string {
  return `${FAVORITES_KEY}:${username ?? "guest"}`;
}

export async function loadFavoriteIds(username: string | null = null): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(getFavoritesKeyForUser(username));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteIds(ids: string[], username: string | null = null): Promise<void> {
  try {
    await AsyncStorage.setItem(getFavoritesKeyForUser(username), JSON.stringify(ids));
  } catch {
    // ignora errori storage in dev
  }
}

export async function loadStoredUser(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? raw : null;
  } catch {
    return null;
  }
}

export async function saveStoredUser(username: string | null): Promise<void> {
  try {
    if (username) {
      await AsyncStorage.setItem(USER_KEY, username);
    } else {
      await AsyncStorage.removeItem(USER_KEY);
    }
  } catch {
    // ignora errori storage in dev
  }
}