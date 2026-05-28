
import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    const storedValue = window.localStorage.getItem(key);

    if (!storedValue) {
      return defaultValue;
    }

    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
