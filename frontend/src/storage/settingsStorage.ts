
import { STORAGE_KEYS } from "../constants/storageKeys";
import type { AppSettings } from "../types/settings";
import {
  readLocalStorageValue,
  writeLocalStorageValue,
} from './localStorage';

export const defaultSettings: AppSettings = {
  theme: "dark",
  defaultRunSize: 20,
  autoHideText: true
};

export function readSettings(): AppSettings {
  return {
    ...defaultSettings,
    ...readLocalStorageValue<Partial<AppSettings>>(STORAGE_KEYS.settings, {}),
  };
}

export function writeSettings(settings: AppSettings): void {
  writeLocalStorageValue(STORAGE_KEYS.settings, settings);
}
