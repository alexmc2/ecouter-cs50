
import { STORAGE_KEYS } from "../constants/storageKeys";
import {
  readLocalStorageValue,
  writeLocalStorageValue,
} from './localStorage';

export interface LocalProgress {
  lastPosition: number;
  currentRunId: string | null;
  currentSentenceIndex: number;
  currentStepIndex: number;
}

export const defaultProgress: LocalProgress = {
  lastPosition: 1,
  currentRunId: null,
  currentSentenceIndex: 0,
  currentStepIndex: 0,
};

export function normalizeProgress(
  progress: Partial<LocalProgress> | null | undefined,
): LocalProgress {
  const value =
    progress && typeof progress === 'object' ? progress : defaultProgress;

  return {
    lastPosition:
      typeof value.lastPosition === 'number' && value.lastPosition > 0
        ? Math.floor(value.lastPosition)
        : defaultProgress.lastPosition,
    currentRunId:
      typeof value.currentRunId === 'string'
        ? value.currentRunId
        : defaultProgress.currentRunId,
    currentSentenceIndex:
      typeof value.currentSentenceIndex === 'number' &&
      value.currentSentenceIndex >= 0
        ? Math.floor(value.currentSentenceIndex)
        : defaultProgress.currentSentenceIndex,
    currentStepIndex:
      typeof value.currentStepIndex === 'number' &&
      value.currentStepIndex >= 0
        ? Math.floor(value.currentStepIndex)
        : defaultProgress.currentStepIndex,
  };
}

export function readProgress(): LocalProgress {
  return normalizeProgress(
    readLocalStorageValue<Partial<LocalProgress>>(STORAGE_KEYS.progress, {}),
  );
}

export function writeProgress(progress: LocalProgress): void {
  writeLocalStorageValue(STORAGE_KEYS.progress, progress);
}
