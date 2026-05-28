import { STORAGE_KEYS } from '../constants/storageKeys';
import type { CurrentRun } from '../types/currentRun';
import {
  readLocalStorageValue,
  writeLocalStorageValue,
} from './localStorage';

export function readCurrentRun(): CurrentRun | null {
  return readLocalStorageValue<CurrentRun | null>(STORAGE_KEYS.currentRun, null);
}

export function writeCurrentRun(run: CurrentRun | null): void {
  writeLocalStorageValue(STORAGE_KEYS.currentRun, run);
}
