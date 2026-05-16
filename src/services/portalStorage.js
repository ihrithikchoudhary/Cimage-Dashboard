import { useEffect, useState } from "react";

const STORAGE_PREFIX = "cimage-student-dashboard:";

const getStorageKey = (key) => `${STORAGE_PREFIX}${key}`;

export const readPortalValue = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(getStorageKey(key));
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const writePortalValue = (key, value) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(getStorageKey(key), JSON.stringify(value));
  } catch {
    // Storage can fail in private mode or when the browser quota is full.
  }
};

export const usePersistentState = (key, fallback) => {
  const [value, setValue] = useState(() => readPortalValue(key, fallback));

  useEffect(() => {
    writePortalValue(key, value);
  }, [key, value]);

  return [value, setValue];
};
