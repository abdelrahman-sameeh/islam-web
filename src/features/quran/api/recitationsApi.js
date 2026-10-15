import axios from "axios";
import { loadWithOfflineFallback } from "../../../lib/offlineResourceStore";

const RECITERS_URL = "https://www.mp3quran.net/api/v3/reciters?language=ar";

export const DEFAULT_RECITER = {
  id: "minshawi-default",
  name: "محمد صديق المنشاوي",
  server: "https://server10.mp3quran.net/minsh/",
  availableSurahs: null,
};

export const getReciters = async (signal) => {
  return loadWithOfflineFallback({
    key: "quran-reciters:ar",
    group: "quran-reciters",
    limit: 1,
    signal,
    isValid: (value) => Array.isArray(value) && value.length > 0,
    load: async () => {
      const response = await axios.get(RECITERS_URL, { signal });
      const reciters = response.data?.reciters;

      if (!Array.isArray(reciters)) {
        throw new Error("INVALID_RECITERS_RESPONSE");
      }

      return reciters.flatMap((reciter) =>
        (reciter.moshaf ?? []).map((moshaf) => ({
          id: `${reciter.id}-${moshaf.id}`,
          name: `${reciter.name} · ${moshaf.name}`,
          server: moshaf.server,
          availableSurahs: moshaf.surah_list?.split(",") ?? [],
        }))
      );
    },
  });
};

export const getSurahAudioUrl = (server, surahId) =>
  `${server}${String(surahId).padStart(3, "0")}.mp3`;
