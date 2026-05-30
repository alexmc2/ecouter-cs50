import { STORAGE_KEYS } from '../constants/storageKeys';
import type { AppSettings } from '../types/settings';
import {
  readLocalStorageValue,
  writeLocalStorageValue,
} from './localStorage';

export type StoredAppSettings = Partial<AppSettings>;

export const defaultSettings: AppSettings = {
  theme: 'dark',
  defaultRunSize: 20,
  autoShowFrenchText: false,
  autoShowEnglishText: false,
};

export function normalizeSettings(settings: StoredAppSettings): AppSettings {
  return {
    theme: settings.theme ?? defaultSettings.theme,
    defaultRunSize: settings.defaultRunSize ?? defaultSettings.defaultRunSize,
    autoShowFrenchText:
      settings.autoShowFrenchText ?? defaultSettings.autoShowFrenchText,
    autoShowEnglishText:
      settings.autoShowEnglishText ?? defaultSettings.autoShowEnglishText,
  };
}

export function readSettings(): AppSettings {
  return normalizeSettings(
    readLocalStorageValue<StoredAppSettings>(STORAGE_KEYS.settings, {}),
  );
}

export function writeSettings(settings: AppSettings): void {
  writeLocalStorageValue(STORAGE_KEYS.settings, settings);
}
