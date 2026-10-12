import { useEffect, useState } from "react";
import { getRandomHadith } from "../../hadith/api/hadithApi";
import { getSurahAyahs } from "../../quran/api/quranApi";
import { getStoredJson, setStoredJson } from "../../../lib/deviceStorage";

const STORAGE_KEY = "islamona.session-content.v1";

const getPassageSignature = (passage) =>
  passage
    ? `${passage.surahId}:${passage.fromAyah}-${passage.toAyah}`
    : null;

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

    const controller = new AbortController();
    let isActive = true;

    const loadHadith = async () => {
      if (hadithRequestVersion === 0) {
        const stored = await getStoredJson(STORAGE_KEY);
        const storedHadith =
          stored?.signature === signature && stored?.hadith?.text
            ? stored.hadith
            : null;

        if (!isActive) return;
        if (storedHadith) {
          setHadithState({ status: "success", data: storedHadith });
          return;
        }
      }

      setHadithState({ status: "loading", data: null });

      try {
        const hadith = await getRandomHadith(controller.signal);
        if (!isActive) return;

        void setStoredJson(STORAGE_KEY, { signature, hadith });
        setHadithState({ status: "success", data: hadith });
      } catch {
        if (!controller.signal.aborted && isActive) {
          setHadithState({ status: "error", data: null });
        }
      }
    };

    void loadHadith();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [hadithRequestVersion, signature]);

  return {
    ayahState,
    hadithState,
    retryAyahs: () => setAyahRequestVersion((value) => value + 1),
    retryHadith: () => setHadithRequestVersion((value) => value + 1),
  };
};
