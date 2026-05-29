import { STORAGE_KEYS } from '../constants/storageKeys';
import type { CurrentRun } from '../types/currentRun';
import type { Sentence } from '../types/sentence';
import {
  readLocalStorageValue,
  writeLocalStorageValue,
} from './localStorage';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSentence(value: unknown): value is Sentence {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.frText === 'string' &&
    typeof value.enText === 'string' &&
    typeof value.enCharLength === 'number' &&
    typeof value.position === 'number' &&
    typeof value.frFemaleAudioUrl === 'string' &&
    typeof value.frMaleAudioUrl === 'string' &&
    typeof value.enFemaleAudioUrl === 'string' &&
    typeof value.enMaleAudioUrl === 'string'
  );
}

function isCurrentRun(value: unknown): value is CurrentRun {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.label === 'string' &&
    typeof value.createdAt === 'string' &&
    Array.isArray(value.sentences) &&
    value.sentences.every(isSentence)
  );
}

export function readCurrentRun(): CurrentRun | null {
  const storedRun = readLocalStorageValue<unknown>(
    STORAGE_KEYS.currentRun,
    null,
  );

  return isCurrentRun(storedRun) ? storedRun : null;
}

export function writeCurrentRun(run: CurrentRun | null): void {
  writeLocalStorageValue(STORAGE_KEYS.currentRun, run);
}
