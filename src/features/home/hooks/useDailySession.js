import { useEffect, useState } from "react";
import {
  DAILY_PASSAGES,
  DAILY_SESSION_DURATIONS,
} from "../data/dailyPassages";

const STORAGE_KEY = "islamona.daily-session.v2";
const DEFAULT_DURATION = 5;

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

const selectRandomPassage = (duration, excludedId) => {
  const matchingPassages = DAILY_PASSAGES.filter(
    (passage) => passage.duration === duration
  );
  const availablePassages = matchingPassages.filter(
    (passage) => passage.id !== excludedId
  );
  const pool = availablePassages.length ? availablePassages : matchingPassages;

  return pool[Math.floor(Math.random() * pool.length)];
};

const createInitialState = () => {
  const date = getLocalDateKey();
  const storedSession = readStoredSession();
  const storedPassage = DAILY_PASSAGES.find(
    (passage) => passage.id === storedSession?.passageId
  );
  const isKnownDuration = DAILY_SESSION_DURATIONS.includes(
    storedSession?.duration
  );

  if (
    storedSession?.date === date &&
    storedPassage?.duration === storedSession?.duration &&
    isKnownDuration
  ) {
    return {
      date,
      passageId: storedPassage.id,
      duration: storedSession.duration,
      isStarted: Boolean(storedSession.isStarted),
    };
  }

  const passage = selectRandomPassage(
    DEFAULT_DURATION,
    storedSession?.passageId
  );

  return {
    date,
    passageId: passage.id,
    duration: DEFAULT_DURATION,
    isStarted: false,
  };
};

const persistSession = (state) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The experience still works when storage is unavailable or full.
  }
};

export const useDailySession = () => {
  const [state, setState] = useState(createInitialState);

  useEffect(() => {
    persistSession(state);
  }, [state]);

  const passage =
    DAILY_PASSAGES.find((item) => item.id === state.passageId) ??
    DAILY_PASSAGES.find((item) => item.duration === state.duration);

  const setDuration = (duration) => {
    if (!DAILY_SESSION_DURATIONS.includes(duration)) return;

    if (duration === state.duration) return;

    const nextPassage = selectRandomPassage(duration);
    setState((currentState) => ({
      ...currentState,
      passageId: nextPassage.id,
      duration,
      isStarted: false,
    }));
  };

  const chooseAnotherSession = () => {
    const nextPassage = selectRandomPassage(state.duration, state.passageId);

    setState((currentState) => ({
      ...currentState,
      passageId: nextPassage.id,
      isStarted: false,
    }));
  };

  const markStarted = () => {
    setState((currentState) => ({ ...currentState, isStarted: true }));
  };

  return {
    passage,
    duration: state.duration,
    isStarted: state.isStarted,
    setDuration,
    chooseAnotherSession,
    markStarted,
  };
};
