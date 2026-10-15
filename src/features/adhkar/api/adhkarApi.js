import axios from "axios";
import { loadWithOfflineFallback } from "../../../lib/offlineResourceStore";

const ADHKAR_URL =
  "https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json";

const extractDhikrText = (content) => {
  const text = typeof content === "string" ? content : "";
  const serializedListItem = text.match(
    /'"([\s\S]*?)"\.\s*\[[^\]]+\]\./
  );

  return (serializedListItem?.[1] ?? text).trim();
};

export const getAdhkar = async (signal) => {
  return loadWithOfflineFallback({
    key: "adhkar:all",
    group: "adhkar",
    limit: 1,
    signal,
    isValid: (value) => Array.isArray(value) && value.length > 0,
    load: async () => {
      const response = await axios.get(ADHKAR_URL, { signal });
      const categories = response.data;

      if (
        !categories ||
        Array.isArray(categories) ||
        typeof categories !== "object"
      ) {
        throw new Error("INVALID_ADHKAR_RESPONSE");
      }

      return Object.entries(categories).map(([title, groups]) => ({
        title,
        items: Array.isArray(groups)
          ? groups.flat().map((item) => ({
              ...item,
              content: extractDhikrText(item.content),
            }))
          : [],
      }));
    },
  });
};
