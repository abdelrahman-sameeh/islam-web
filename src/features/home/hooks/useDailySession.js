import { useEffect, useRef, useState } from "react";
import {
  DAILY_SESSION_DURATIONS,
  DEFAULT_SESSION_DURATION,
} from "../data/sessionConfig";
import { createRandomTimedPassage } from "../utils/selectTimedPassage";

const STORAGE_KEY = "islamona.daily-session.v3";

const getLocalDateKey = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${day}`;
};

const readStoredSession = () => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
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

const createInitialState = () => {
  const date = getLocalDateKey();
  const storedSession = readStoredSession();
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

  return {
    date,
    duration: DEFAULT_SESSION_DURATION,
    passage: null,
    excludedPassage: null,
    isStarted: false,
    requestVersion: 0,
  };
};

const persistSession = ({ date, duration, passage, isStarted }) => {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date, duration, passage, isStarted })
    );
  } catch {
    // The session still works when browser storage is unavailable or full.
  }
};

export const useDailySession = () => {
  const [state, setState] = useState(createInitialState);
  const [status, setStatus] = useState(
    state.passage ? "success" : "idle"
  );
  const [error, setError] = useState(null);
  const requestController = useRef(null);

  useEffect(() => {
    if (state.passage) {
      persistSession({
        date: state.date,
        duration: state.duration,
        passage: state.passage,
        isStarted: state.isStarted,
      });
    }
  }, [state.date, state.duration, state.isStarted, state.passage]);

  useEffect(() => {
    if (state.passage) return undefined;

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
  }, [state.duration, state.excludedPassage, state.passage, state.requestVersion]);

  const setDuration = (duration) => {
    if (
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
    setState((currentState) => ({
      ...currentState,
      requestVersion: currentState.requestVersion + 1,
    }));
  };

  const markStarted = () => {
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
