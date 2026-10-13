import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { stripArabicMarks } from "../../../lib/normalizeArabicText";
import { searchQuranAyahs } from "../api/quranSearchApi";

const useVerseSearch = ({ surahId, ayahNumber }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const verseQuery = searchParams.get("q")?.trim() ?? "";
  const [draftQuery, setDraftQuery] = useState(verseQuery);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const [validationError, setValidationError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    setDraftQuery(verseQuery);
  }, [verseQuery]);

  useEffect(() => {
    if (!verseQuery) {
      setResult(null);
      setStatus("idle");
      return undefined;
    }

    const controller = new AbortController();
    setStatus("loading");

    searchQuranAyahs(verseQuery, controller.signal)
      .then((searchResult) => {
        setResult(searchResult);
        setStatus(searchResult.items.length ? "success" : "empty");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, [requestVersion, verseQuery]);

  const changeDraftQuery = (value) => {
    setDraftQuery(value);
    setValidationError("");
  };

  const search = () => {
    const phrase = draftQuery.trim();

    if (stripArabicMarks(phrase).length < 3) {
      setValidationError("اكتب ثلاث حروف على الأقل من نص الآية.");
      return;
    }

    setValidationError("");
    setSearchParams({
      surah: surahId,
      ayah: String(ayahNumber),
      q: phrase,
    });
  };

  const selectResult = (item) => {
    setSearchParams({
      surah: item.surahId,
      ayah: String(item.ayahNumber),
    });
  };

  return {
    draftQuery,
    result,
    status,
    validationError,
    changeDraftQuery,
    search,
    selectResult,
    retry: () => setRequestVersion((value) => value + 1),
  };
};

export default useVerseSearch;
