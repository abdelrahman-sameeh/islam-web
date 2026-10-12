import suwarList from "../../../utils/suwar";
import { getSurahAyahs } from "../api/dailySessionApi";
import {
  ESTIMATED_WORDS_PER_MINUTE,
  MAX_RANDOM_SURAH_ATTEMPTS,
} from "../data/sessionConfig";

const MIN_TARGET_RATIO = 0.82;
const MAX_TARGET_RATIO = 1.25;

const randomItem = (items) =>
  items[Math.floor(Math.random() * items.length)];

const countWords = (text = "") =>
  text.trim().split(/\s+/).filter(Boolean).length;

const getCandidateRanges = (ayahs, targetWords) => {
  const minimumWords = Math.floor(targetWords * MIN_TARGET_RATIO);
  const maximumWords = Math.ceil(targetWords * MAX_TARGET_RATIO);
  const candidates = [];

  ayahs.forEach((_, startIndex) => {
    let wordCount = 0;

    for (let endIndex = startIndex; endIndex < ayahs.length; endIndex += 1) {
      wordCount += countWords(ayahs[endIndex].text);

      if (wordCount >= minimumWords) {
        candidates.push({ startIndex, endIndex, wordCount });
        break;
      }
    }
  });

  const candidatesWithinLimit = candidates.filter(
    ({ wordCount }) => wordCount <= maximumWords
  );

  return candidatesWithinLimit.length ? candidatesWithinLimit : candidates;
};

const selectRange = (ayahs, duration, excludedRange) => {
  const targetWords = duration * ESTIMATED_WORDS_PER_MINUTE;
  const candidates = getCandidateRanges(ayahs, targetWords)
    .filter(({ startIndex, endIndex }) => {
      const fromAyah = ayahs[startIndex].number;
      const toAyah = ayahs[endIndex].number;

      return `${fromAyah}-${toAyah}` !== excludedRange;
    })
    .sort(
      (first, second) =>
        Math.abs(first.wordCount - targetWords) -
        Math.abs(second.wordCount - targetWords)
    );

  if (!candidates.length) return null;

  // Keep the timing close while leaving the starting point genuinely random.
  const closestCandidates = candidates.slice(
    0,
    Math.max(3, Math.ceil(candidates.length * 0.35))
  );
  const selected = randomItem(closestCandidates);

  return {
    fromAyah: ayahs[selected.startIndex].number,
    toAyah: ayahs[selected.endIndex].number,
    wordCount: selected.wordCount,
  };
};

const selectFromSurah = async (surah, duration, signal, excludedPassage) => {
  const ayahs = await getSurahAyahs(surah.id, signal);
  const excludedRange =
    String(excludedPassage?.surahId) === String(surah.id)
      ? `${excludedPassage.fromAyah}-${excludedPassage.toAyah}`
      : null;
  const range = selectRange(ayahs, duration, excludedRange);

  if (!range) return null;

  return {
    surahId: surah.id,
    surahName: surah.label,
    ...range,
  };
};

export const createRandomTimedPassage = async ({
  duration,
  signal,
  excludedPassage,
}) => {
  const availableSurahs = [...suwarList];

  for (
    let attempt = 0;
    attempt < MAX_RANDOM_SURAH_ATTEMPTS && availableSurahs.length;
    attempt += 1
  ) {
    const surah = randomItem(availableSurahs);
    availableSurahs.splice(availableSurahs.indexOf(surah), 1);

    const passage = await selectFromSurah(
      surah,
      duration,
      signal,
      excludedPassage
    );

    if (passage) return passage;
  }

  // These early long surahs guarantee a timed range when every first pick is
  // too short. Both the fallback surah and its starting position stay random.
  const randomLongSurah = randomItem(suwarList.slice(1, 12));
  return selectFromSurah(randomLongSurah, duration, signal, excludedPassage);
};
