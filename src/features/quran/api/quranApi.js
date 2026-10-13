import axios from "axios";

const QURAN_ENC_BASE_URL =
  "https://quranenc.com/api/v1/translation/sura/arabic_moyassar";

const isValidSurahId = (surahId) => {
  const value = Number(surahId);
  return Number.isInteger(value) && value >= 1 && value <= 114;
};

export const getSurahAyahs = async (surahId, signal) => {
  if (!isValidSurahId(surahId)) throw new Error("INVALID_SURAH_ID");

  const response = await axios.get(`${QURAN_ENC_BASE_URL}/${surahId}`, {
    signal,
  });
  const result = response.data?.result;

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error("INVALID_SURAH_RESPONSE");
  }

  return result.map((ayah) => ({
    id: String(ayah.id ?? `${surahId}-${ayah.aya}`),
    number: Number(ayah.aya),
    text: ayah.arabic_text,
    tafsir: ayah.translation,
  }));
};
