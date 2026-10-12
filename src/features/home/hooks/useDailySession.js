import { useEffect, useState } from "react";
import {
  DAILY_SESSION_DURATIONS,
  DAILY_SESSIONS,
} from "../data/dailySessions";

const STORAGE_KEY = "islamona.daily-session.v1";
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

const selectRandomSession = (excludedId) => {
  const availableSessions = DAILY_SESSIONS.filter(
    (session) => session.id !== excludedId
  );
  const pool = availableSessions.length ? availableSessions : DAILY_SESSIONS;

  return pool[Math.floor(Math.random() * pool.length)];
};

const createInitialState = () => {
  const date = getLocalDateKey();
  const storedSession = readStoredSession();
  const isKnownSession = DAILY_SESSIONS.some(
    (session) => session.id === storedSession?.sessionId
  );
  const isKnownDuration = DAILY_SESSION_DURATIONS.includes(
    storedSession?.duration
  );

  if (storedSession?.date === date && isKnownSession) {
    return {
      date,
      sessionId: storedSession.sessionId,
      duration: isKnownDuration ? storedSession.duration : DEFAULT_DURATION,
      isStarted: Boolean(storedSession.isStarted),
    };
  }

  const session = selectRandomSession(storedSession?.sessionId);

  return {
    date,
    sessionId: session.id,
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

  const session =
    DAILY_SESSIONS.find((item) => item.id === state.sessionId) ??
    DAILY_SESSIONS[0];

  const setDuration = (duration) => {
    if (!DAILY_SESSION_DURATIONS.includes(duration)) return;

    setState((currentState) => ({ ...currentState, duration }));
  };

  const chooseAnotherSession = () => {
    const nextSession = selectRandomSession(state.sessionId);

    setState((currentState) => ({
      ...currentState,
      sessionId: nextSession.id,
      isStarted: false,
    }));
  };

  const markStarted = () => {
    setState((currentState) => ({ ...currentState, isStarted: true }));
  };

  return {
    session,
    duration: state.duration,
    isStarted: state.isStarted,
    setDuration,
    chooseAnotherSession,
    markStarted,
  };
};
