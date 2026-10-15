import { useCallback, useEffect, useRef, useState } from "react";
import {
  cacheQuranAudio,
  getCachedQuranAudio,
} from "../storage/quranAudioCache";

const useOfflineQuranAudio = (audioUrl) => {
  const [source, setSource] = useState(audioUrl);
  const [cacheStatus, setCacheStatus] = useState("checking");
  const [playbackError, setPlaybackError] = useState("");
  const currentAudioUrl = useRef(audioUrl);

  useEffect(() => {
    let isActive = true;
    let objectUrl;
    currentAudioUrl.current = audioUrl;
    setSource(audioUrl);
    setCacheStatus("checking");
    setPlaybackError("");

    getCachedQuranAudio(audioUrl).then((audioBlob) => {
      if (!isActive) return;

      if (!audioBlob) {
        setCacheStatus("remote");
        return;
      }

      objectUrl = URL.createObjectURL(audioBlob);
      setSource(objectUrl);
      setCacheStatus("cached");
    });

    return () => {
      isActive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [audioUrl]);

  const saveForOffline = useCallback(async () => {
    if (!audioUrl || cacheStatus === "cached" || cacheStatus === "saving") {
      return;
    }

    setCacheStatus("saving");
    try {
      await cacheQuranAudio(audioUrl);
      if (currentAudioUrl.current === audioUrl) setCacheStatus("cached");
    } catch {
      if (currentAudioUrl.current === audioUrl) setCacheStatus("error");
    }
  }, [audioUrl, cacheStatus]);

  const handlePlaybackError = useCallback(() => {
    const isOffline =
      typeof navigator !== "undefined" && navigator.onLine === false;
    setPlaybackError(
      isOffline
        ? "هذه التلاوة غير محفوظة على الجهاز بعد. شغّلها مرة أثناء الاتصال أولًا."
        : "تعذّر تشغيل التلاوة الآن. حاول مرة أخرى."
    );
  }, []);

  const statusMessage =
    cacheStatus === "saving"
      ? "جاري حفظ التلاوة لتعمل دون إنترنت..."
      : cacheStatus === "cached"
      ? "التلاوة محفوظة ومتاحة دون إنترنت."
      : cacheStatus === "error"
      ? "استمر التشغيل، لكن تعذّر حفظ التلاوة على الجهاز."
      : "سيتم حفظ التلاوة تلقائيًا عند بدء تشغيلها.";

  return {
    source,
    statusMessage,
    playbackError,
    saveForOffline,
    clearPlaybackError: () => setPlaybackError(""),
    handlePlaybackError,
  };
};

export default useOfflineQuranAudio;
