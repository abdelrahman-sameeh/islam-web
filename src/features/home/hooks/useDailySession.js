import { useEffect, useRef, useState } from "react";
import {
  DAILY_SESSION_DURATIONS,
  DEFAULT_SESSION_DURATION,
} from "../data/sessionConfig";
import { createRandomTimedPassage } from "../utils/selectTimedPassage";
import { getStoredJson, setStoredJson } from "../../../lib/browserStorage";

const STORAGE_KEY = "islamona.daily-session.v3";

const getLocalDateKey = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${day}`;
};

const isValidPassage = (passage) => {
  const surahId = Number(passage?.surahId);

  return (
    passage &&
    Number.isInteger(surahId) &&
    surahId >= 1 &&
    surahId <= 114 &&
    typeof passage.surahName === "string" &&
    passage.surahName.trim().length > 0 &&
    Number.isInteger(passage.fromAyah) &&
    Number.isInteger(passage.toAyah) &&
    passage.fromAyah > 0 &&
    passage.toAyah >= passage.fromAyah &&
    Number.isInteger(passage.wordCount) &&
    passage.wordCount > 0
  );
};

const createEmptyState = () => ({
  date: getLocalDateKey(),
  duration: DEFAULT_SESSION_DURATION,
  passage: null,
  excludedPassage: null,
  isStarted: false,
  requestVersion: 0,
});

const createStateFromStoredSession = (storedSession) => {
  const date = getLocalDateKey();
  const isKnownDuration = DAILY_SESSION_DURATIONS.includes(
    storedSession?.duration
  );

  if (
    storedSession?.date === date &&
    isKnownDuration &&
    isValidPassage(storedSession.passage)
  ) {
    return {
      date,
      duration: storedSession.duration,
      passage: storedSession.passage,
      excludedPassage: null,
      isStarted: Boolean(storedSession.isStarted),
      requestVersion: 0,
    };
  }

  return createEmptyState();
};

export const useDailySession = () => {
  const [state, setState] = useState(createEmptyState);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const requestController = useRef(null);

  useEffect(() => {
    let isActive = true;

    getStoredJson(STORAGE_KEY).then((storedSession) => {
      if (!isActive) return;

      const storedState = createStateFromStoredSession(storedSession);
      setState(storedState);
      if (storedState.passage) setStatus("success");
      setIsStorageReady(true);
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (isStorageReady && state.passage) {
      void setStoredJson(STORAGE_KEY, {
        date: state.date,
        duration: state.duration,
        passage: state.passage,
        isStarted: state.isStarted,
      });
    }
  }, [isStorageReady, state.date, state.duration, state.isStarted, state.passage]);

  useEffect(() => {
    if (!isStorageReady || state.passage) return undefined;

    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    const requestedDuration = state.duration;
    const requestedVersion = state.requestVersion;

    setStatus("loading");
    setError(null);

    createRandomTimedPassage({
      duration: requestedDuration,
      signal: controller.signal,
      excludedPassage: state.excludedPassage,
    })
      .then((passage) => {
        if (controller.signal.aborted || !passage) return;

        setState((currentState) => {
          if (
            currentState.duration !== requestedDuration ||
            currentState.requestVersion !== requestedVersion
          ) {
            return currentState;
          }

          return {
            ...currentState,
            passage,
            excludedPassage: null,
          };
        });
        setStatus("success");
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setStatus("error");
        setError("تعذّر اختيار المقطع الآن. تأكد من الاتصال وحاول مرة أخرى.");
      });

    return () => controller.abort();
  }, [
    isStorageReady,
    state.duration,
    state.excludedPassage,
    state.passage,
    state.requestVersion,
  ]);

  const setDuration = (duration) => {
    if (
      !isStorageReady ||
      !DAILY_SESSION_DURATIONS.includes(duration) ||
      duration === state.duration
    ) {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      date: getLocalDateKey(),
      duration,
      passage: null,
      excludedPassage: null,
      isStarted: false,
      requestVersion: currentState.requestVersion + 1,
    }));
  };

  const chooseAnotherSession = () => {
    if (!isStorageReady) return;

    setState((currentState) => ({
      ...currentState,
      date: getLocalDateKey(),
      passage: null,
      excludedPassage: currentState.passage,
      isStarted: false,
      requestVersion: currentState.requestVersion + 1,
    }));
  };

  const retry = () => {
    if (!isStorageReady) return;

    setState((currentState) => ({
      ...currentState,
      requestVersion: currentState.requestVersion + 1,
    }));
  };

  const markStarted = () => {
    if (!isStorageReady) return;
    setState((currentState) => ({ ...currentState, isStarted: true }));
  };

  return {
    passage: state.passage,
    duration: state.duration,
    isStarted: state.isStarted,
    status,
    error,
    setDuration,
    chooseAnotherSession,
    retry,
    markStarted,
  };
};
