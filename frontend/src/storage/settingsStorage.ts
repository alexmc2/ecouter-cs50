
import { STORAGE_KEYS } from "../constants/storageKeys";
import type { AppSettings } from "../types/settings";

export const defaultSettings: AppSettings = {
  theme: "dark",
  defaultRunSize: 20,
  autoHideText: true
};

export function readSettings(): AppSettings {
  const storedSettings = window.localStorage.getItem(STORAGE_KEYS.settings);

  if (!storedSettings) {
    return defaultSettings;
  }

  try {
    return { ...defaultSettings, ...(JSON.parse(storedSettings) as Partial<AppSettings>) };
  } catch {
    return defaultSettings;
  }
}

export function writeSettings(settings: AppSettings): void {
  window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}
