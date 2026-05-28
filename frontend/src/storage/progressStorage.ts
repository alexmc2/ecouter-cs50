
import { STORAGE_KEYS } from "../constants/storageKeys";

export interface LocalProgress {
  lastPosition: number;
}

export const defaultProgress: LocalProgress = {
  lastPosition: 1
};

export function readProgress(): LocalProgress {
  const storedProgress = window.localStorage.getItem(STORAGE_KEYS.progress);

  if (!storedProgress) {
    return defaultProgress;
  }

  try {
    return { ...defaultProgress, ...(JSON.parse(storedProgress) as Partial<LocalProgress>) };
  } catch {
    return defaultProgress;
  }
}

export function writeProgress(progress: LocalProgress): void {
  window.localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
}
