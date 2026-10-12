import axios from "axios";
import { stripArabicMarks } from "../../../lib/normalizeArabicText";

const QURAN_SEARCH_URL = "https://api.alquran.cloud/v1/search";
const MAX_RESULTS = 20;

export const searchQuranAyahs = async (phrase, signal) => {
  const normalizedPhrase = stripArabicMarks(phrase);

  if (normalizedPhrase.length < 3) throw new Error("INVALID_SEARCH_PHRASE");

  const response = await axios.get(
    `${QURAN_SEARCH_URL}/${encodeURIComponent(normalizedPhrase)}/all/quran-simple`,
    { signal }
  );
  const matches = response.data?.data?.matches;

  if (!Array.isArray(matches)) throw new Error("INVALID_SEARCH_RESPONSE");

  const validMatches = matches.filter(
    (match) =>
      Number.isInteger(Number(match.surah?.number)) &&
      Number(match.surah.number) >= 1 &&
      Number(match.surah.number) <= 114 &&
      Number.isInteger(Number(match.numberInSurah)) &&
      Number(match.numberInSurah) > 0 &&
      typeof match.text === "string"
  );

  return {
    totalItems: Number(response.data?.data?.count ?? matches.length),
    items: validMatches.slice(0, MAX_RESULTS).map((match) => ({
      id: `${match.surah?.number}:${match.numberInSurah}`,
      surahId: String(match.surah?.number),
      ayahNumber: Number(match.numberInSurah),
      text: match.text,
    })),
  };
};
