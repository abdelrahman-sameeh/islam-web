import { useEffect, useState } from "react";
import { getRandomHadith } from "../../hadith/api/hadithApi";
import { getSurahAyahs } from "../../quran/api/quranApi";

const STORAGE_KEY = "islamona.session-content.v1";

const getPassageSignature = (passage) =>
  passage
    ? `${passage.surahId}:${passage.fromAyah}-${passage.toAyah}`
    : null;

const readStoredHadith = (signature) => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return stored?.signature === signature && stored?.hadith?.text
      ? stored.hadith
      : null;
  } catch {
    return null;
  }
};

const persistHadith = (signature, hadith) => {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ signature, hadith })
    );
  } catch {
    // The content remains available for the current visit.
  }
};

export const useSessionContent = (passage) => {
  const [ayahState, setAyahState] = useState({ status: "idle", data: [] });
  const [hadithState, setHadithState] = useState({ status: "idle", data: null });
  const [ayahRequestVersion, setAyahRequestVersion] = useState(0);
  const [hadithRequestVersion, setHadithRequestVersion] = useState(0);
  const signature = getPassageSignature(passage);

  useEffect(() => {
    if (!passage) {
      setAyahState({ status: "idle", data: [] });
      return undefined;
    }

    const controller = new AbortController();
    setAyahState({ status: "loading", data: [] });

    getSurahAyahs(passage.surahId, controller.signal)
      .then((ayahs) => {
        const selectedAyahs = ayahs.filter(
          ({ number }) =>
            number >= passage.fromAyah && number <= passage.toAyah
        );
        setAyahState({
          status: selectedAyahs.length ? "success" : "empty",
          data: selectedAyahs,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setAyahState({ status: "error", data: [] });
        }
      });

    return () => controller.abort();
  }, [ayahRequestVersion, passage]);

  useEffect(() => {
    if (!signature) {
      setHadithState({ status: "idle", data: null });
      return undefined;
    }

    const storedHadith = readStoredHadith(signature);
    if (storedHadith && hadithRequestVersion === 0) {
      setHadithState({ status: "success", data: storedHadith });
      return undefined;
    }

    const controller = new AbortController();
    setHadithState({ status: "loading", data: null });

    getRandomHadith(controller.signal)
      .then((hadith) => {
        persistHadith(signature, hadith);
        setHadithState({ status: "success", data: hadith });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setHadithState({ status: "error", data: null });
        }
      });

    return () => controller.abort();
  }, [hadithRequestVersion, signature]);

  return {
    ayahState,
    hadithState,
    retryAyahs: () => setAyahRequestVersion((value) => value + 1),
    retryHadith: () => setHadithRequestVersion((value) => value + 1),
  };
};
