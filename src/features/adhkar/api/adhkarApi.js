import axios from "axios";

const ADHKAR_URL =
  "https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json";

export const getAdhkar = async (signal) => {
  const response = await axios.get(ADHKAR_URL, { signal });
  const categories = response.data;

  if (!categories || Array.isArray(categories) || typeof categories !== "object") {
    throw new Error("INVALID_ADHKAR_RESPONSE");
  }

  return Object.entries(categories).map(([title, groups]) => ({
    title,
    items: Array.isArray(groups) ? groups.flat() : [],
  }));
};
