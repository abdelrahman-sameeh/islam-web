import { useCallback, useEffect, useRef, useState } from "react";
import QuranAudio from "../native/quranAudioPlugin";

const INITIAL_STATE = {
  currentUrl: "",
  isPlaying: false,
  position: 0,
  duration: 0,
  playbackState: "idle",
  cacheStatus: "remote",
  error: "",
};

const useAndroidQuranAudio = ({ audioUrl, title, artist }) => {
  const [playerState, setPlayerState] = useState(INITIAL_STATE);
  const [actionError, setActionError] = useState("");
  const previousAudioUrl = useRef(audioUrl);

  const syncState = useCallback(async () => {
    try {
      const nextState = await QuranAudio.getState({ url: audioUrl });
      setPlayerState(nextState);
    } catch {
      setActionError("تعذّر الاتصال بمشغّل التلاوة. حاول مرة أخرى.");
    }
  }, [audioUrl]);

  useEffect(() => {
    let isActive = true;
    let listenerHandle;

    QuranAudio.addListener("playbackStateChanged", (nextState) => {
      if (isActive) setPlayerState(nextState);
    })
      .then((handle) => {
        if (isActive) listenerHandle = handle;
        else void handle.remove();
      })
      .catch(() => {
        if (isActive) {
          setActionError("تعذّر الاتصال بمشغّل التلاوة. حاول مرة أخرى.");
        }
      });

    void syncState();
    const progressTimer = window.setInterval(syncState, 1000);

    return () => {
      isActive = false;
      window.clearInterval(progressTimer);
      if (listenerHandle) void listenerHandle.remove();
    };
  }, [syncState]);

  useEffect(() => {
    if (
      previousAudioUrl.current &&
      audioUrl &&
      previousAudioUrl.current !== audioUrl
    ) {
      void QuranAudio.stop().catch(() => {});
    }
    previousAudioUrl.current = audioUrl;
  }, [audioUrl]);

  const isCurrentAudio = playerState.currentUrl === audioUrl;

  const togglePlayback = async () => {
    setActionError("");
    try {
      const nextState =
        isCurrentAudio && playerState.isPlaying
          ? await QuranAudio.pause()
          : await QuranAudio.play({ url: audioUrl, title, artist });
      setPlayerState(nextState);
    } catch {
      setActionError(
        navigator.onLine === false
          ? "هذه التلاوة غير محفوظة بعد، واتصال الإنترنت غير متاح."
          : "تعذّر تشغيل التلاوة الآن. حاول مرة أخرى."
      );
    }
  };

  const seekTo = async (position) => {
    try {
      const nextState = await QuranAudio.seekTo({ position });
      setPlayerState(nextState);
    } catch {
      setActionError("تعذّر الانتقال إلى هذا الموضع في التلاوة.");
    }
  };

  return {
    ...playerState,
    isCurrentAudio,
    displayError: actionError || (playerState.error ? "تعذّر تشغيل التلاوة الآن." : ""),
    togglePlayback,
    seekTo,
  };
};

export default useAndroidQuranAudio;
