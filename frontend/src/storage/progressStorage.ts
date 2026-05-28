
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

export function normalizeProgress(progress: Partial<LocalProgress>): LocalProgress {
  return {
    lastPosition:
      typeof progress.lastPosition === 'number' && progress.lastPosition > 0
        ? Math.floor(progress.lastPosition)
        : defaultProgress.lastPosition,
    currentRunId:
      typeof progress.currentRunId === 'string'
        ? progress.currentRunId
        : defaultProgress.currentRunId,
    currentSentenceIndex:
      typeof progress.currentSentenceIndex === 'number' &&
      progress.currentSentenceIndex >= 0
        ? Math.floor(progress.currentSentenceIndex)
        : defaultProgress.currentSentenceIndex,
    currentStepIndex:
      typeof progress.currentStepIndex === 'number' &&
      progress.currentStepIndex >= 0
        ? Math.floor(progress.currentStepIndex)
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
