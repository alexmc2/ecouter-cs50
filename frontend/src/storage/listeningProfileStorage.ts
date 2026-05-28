
import { DEFAULT_LISTENING_PROFILE } from "../constants/listeningProfileDefaults";
import { STORAGE_KEYS } from "../constants/storageKeys";
import type { ListeningProfile } from "../types/listeningProfile";
import {
  readLocalStorageValue,
  writeLocalStorageValue,
} from './localStorage';

export function createDefaultListeningProfile(): ListeningProfile {
  return {
    ...DEFAULT_LISTENING_PROFILE,
    steps: DEFAULT_LISTENING_PROFILE.steps.map((step) => ({ ...step })),
  };
}

export function readListeningProfile(): ListeningProfile {
  return readLocalStorageValue(
    STORAGE_KEYS.listeningProfile,
    createDefaultListeningProfile(),
  );
}

export function writeListeningProfile(profile: ListeningProfile): void {
  writeLocalStorageValue(STORAGE_KEYS.listeningProfile, profile);
}
