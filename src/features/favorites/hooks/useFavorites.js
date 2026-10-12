import { useCallback, useEffect, useState } from "react";
import {
  FAVORITES_STORAGE_KEY,
  FAVORITES_UPDATED_EVENT,
  getFavoriteKey,
  getFavorites,
  toggleStoredFavorite,
} from "../storage/favoritesStorage";

const useFavorites = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setItems(await getFavorites());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isActive = true;

    getFavorites().then((storedItems) => {
      if (!isActive) return;
      setItems(storedItems);
      setIsLoading(false);
    });

    const handleFavoritesUpdated = (event) => {
      setItems(Array.isArray(event.detail) ? event.detail : []);
      setIsLoading(false);
    };
    const handleStorage = (event) => {
      if (event.key === FAVORITES_STORAGE_KEY) void refresh();
    };

    window.addEventListener(FAVORITES_UPDATED_EVENT, handleFavoritesUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      isActive = false;
      window.removeEventListener(
        FAVORITES_UPDATED_EVENT,
        handleFavoritesUpdated
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, [refresh]);

  const isFavorite = useCallback(
    (type, entityId) => {
      const key = getFavoriteKey(type, String(entityId));
      return items.some((item) => item.key === key);
    },
    [items]
  );

  const toggleFavorite = useCallback(async (favorite) => {
    const nextItems = await toggleStoredFavorite({
      ...favorite,
      entityId: String(favorite.entityId),
    });
    setItems(nextItems);
  }, []);

  return { items, isLoading, isFavorite, toggleFavorite };
};

export default useFavorites;
