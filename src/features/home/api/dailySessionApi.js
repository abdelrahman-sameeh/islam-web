import axios from "axios";

const QURAN_ENC_BASE_URL =
  "https://quranenc.com/api/v1/translation/sura/arabic_moyassar";

export const getSurahAyahs = async (surahId, signal) => {
  const response = await axios.get(`${QURAN_ENC_BASE_URL}/${surahId}`, {
    signal,
  });
  const ayahs = response.data?.result;

  if (!Array.isArray(ayahs) || ayahs.length === 0) {
    throw new Error("INVALID_SURAH_RESPONSE");
  }

  return ayahs.map((ayah) => ({
    number: Number(ayah.aya),
    text: ayah.arabic_text,
  }));
};
