import axios from "axios";
import { loadWithOfflineFallback } from "../../../lib/offlineResourceStore";

const VERSE_AUDIO_BASE_URL = "https://api.alquran.cloud/v1/surah";
const VERSE_AUDIO_EDITION = "ar.alafasy";

const isValidSurahId = (surahId) => {
  const value = Number(surahId);
  return Number.isInteger(value) && value >= 1 && value <= 114;
};

const isValidAudioUrl = (value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

export const getSurahVerseAudio = async (surahId, signal) => {
  if (!isValidSurahId(surahId)) throw new Error("INVALID_SURAH_ID");

  return loadWithOfflineFallback({
    key: `quran-verse-audio:${VERSE_AUDIO_EDITION}:${surahId}`,
    group: "quran-verse-audio",
    limit: 6,
    signal,
    isValid: (value) => Array.isArray(value) && value.length > 0,
    load: async () => {
      const response = await axios.get(
        `${VERSE_AUDIO_BASE_URL}/${surahId}/${VERSE_AUDIO_EDITION}`,
        { signal }
      );
      const ayahs = response.data?.data?.ayahs;

      if (!Array.isArray(ayahs) || ayahs.length === 0) {
        throw new Error("INVALID_VERSE_AUDIO_RESPONSE");
      }

      return ayahs.flatMap((ayah) => {
        const ayahNumber = Number(ayah.numberInSurah);
        if (!Number.isInteger(ayahNumber) || !isValidAudioUrl(ayah.audio)) {
          return [];
        }

        return {
          id: `${surahId}:${ayahNumber}`,
          surahId: String(surahId),
          ayahNumber,
          audioUrl: ayah.audio,
        };
      });
    },
  });
};

export const getVerseAudioRange = async (
  { surahId, fromAyah, toAyah },
  signal
) => {
  const tracks = await getSurahVerseAudio(surahId, signal);
  return tracks.filter(
    ({ ayahNumber }) => ayahNumber >= fromAyah && ayahNumber <= toAyah
  );
};

export const VERSE_AUDIO_SOURCE = {
  edition: VERSE_AUDIO_EDITION,
  label: "AlQuran Cloud · مشاري العفاسي",
};
