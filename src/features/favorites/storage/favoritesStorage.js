import { getStoredJson, setStoredJson } from "../../../lib/browserStorage";

const FAVORITES_STORAGE_KEY = "islamona.favorites.v1";
const FAVORITES_UPDATED_EVENT = "islamona:favorites-updated";
const ALLOWED_TYPES = new Set(["surah", "reciter", "hadith", "tafsir"]);

const isValidFavorite = (item) =>
  item &&
  ALLOWED_TYPES.has(item.type) &&
  typeof item.entityId === "string" &&
  typeof item.title === "string" &&
  typeof item.href === "string" &&
  item.href.startsWith("/");

const notifyFavoritesUpdated = (items) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(FAVORITES_UPDATED_EVENT, { detail: items })
  );
};

export const getFavoriteKey = (type, entityId) => `${type}:${entityId}`;

export const getFavorites = async () => {
  const storedValue = await getStoredJson(FAVORITES_STORAGE_KEY);
  const items = Array.isArray(storedValue?.items) ? storedValue.items : [];
  return items.filter(isValidFavorite).map((item) => ({
    ...item,
    key: getFavoriteKey(item.type, item.entityId),
  }));
};

export const toggleStoredFavorite = async (favorite) => {
  if (!isValidFavorite(favorite)) return getFavorites();

  const items = await getFavorites();
  const key = getFavoriteKey(favorite.type, favorite.entityId);
  const isAlreadySaved = items.some((item) => item.key === key);
  const nextItems = isAlreadySaved
    ? items.filter((item) => item.key !== key)
    : [{ ...favorite, key, savedAt: new Date().toISOString() }, ...items];

  await setStoredJson(FAVORITES_STORAGE_KEY, { items: nextItems });
  notifyFavoritesUpdated(nextItems);
  return nextItems;
};

export { FAVORITES_STORAGE_KEY, FAVORITES_UPDATED_EVENT };
