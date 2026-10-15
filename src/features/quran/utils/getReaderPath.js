import { DEFAULT_RECITER } from "../api/recitationsApi";

const getReaderPath = (surahId, reciterId) => {
  const path = `/quran/surah/${surahId}`;
  return reciterId && reciterId !== DEFAULT_RECITER.id
    ? `${path}?reciter=${encodeURIComponent(reciterId)}`
    : path;
};

export default getReaderPath;
