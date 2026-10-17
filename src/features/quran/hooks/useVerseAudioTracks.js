import { useEffect, useState } from "react";
import { getVerseAudioRange } from "../api/verseAudioApi";

const isValidRange = ({ surahId, fromAyah, toAyah }) => {
  const numericSurahId = Number(surahId);
  return (
    Number.isInteger(numericSurahId) &&
    numericSurahId >= 1 &&
    numericSurahId <= 114 &&
    Number.isInteger(fromAyah) &&
    Number.isInteger(toAyah) &&
    fromAyah > 0 &&
    toAyah >= fromAyah
  );
};

const useVerseAudioTracks = ({ surahId, fromAyah, toAyah }) => {
  const [state, setState] = useState({ status: "idle", tracks: [] });
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const range = { surahId, fromAyah, toAyah };
    if (!isValidRange(range)) {
      setState({ status: "idle", tracks: [] });
      return undefined;
    }

    const controller = new AbortController();
    setState({ status: "loading", tracks: [] });

    getVerseAudioRange(range, controller.signal)
      .then((tracks) => {
        setState({
          status: tracks.length ? "success" : "empty",
          tracks,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ status: "error", tracks: [] });
        }
      });

    return () => controller.abort();
  }, [fromAyah, requestVersion, surahId, toAyah]);

  return {
    ...state,
    retry: () => setRequestVersion((value) => value + 1),
  };
};

export default useVerseAudioTracks;
