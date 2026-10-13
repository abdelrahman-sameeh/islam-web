const canUseBrowserStorage = () =>
  typeof window !== "undefined" && window.localStorage;

export const getStoredValue = async (key) => {
  try {
    return canUseBrowserStorage() ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

export const setStoredValue = async (key, value) => {
  try {
    if (canUseBrowserStorage()) window.localStorage.setItem(key, value);
  } catch {
    // The current visit keeps working if browser storage is unavailable or full.
  }
};

export const getStoredJson = async (key) => {
  const value = await getStoredValue(key);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const setStoredJson = (key, value) =>
  setStoredValue(key, JSON.stringify(value));
