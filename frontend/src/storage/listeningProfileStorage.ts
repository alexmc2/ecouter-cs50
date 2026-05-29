
import { DEFAULT_LISTENING_PROFILE } from "../constants/listeningProfileDefaults";
import { STORAGE_KEYS } from "../constants/storageKeys";
import type {
  AudioSource,
  ListeningProfile,
  ListeningProfileItem,
} from "../types/listeningProfile";
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

const audioSources = new Set<AudioSource>([
  'fr_female',
  'fr_male',
  'en_female',
  'en_male',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isListeningProfileItem(value: unknown): value is ListeningProfileItem {
  if (!isRecord(value)) {
    return false;
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.label !== 'string' ||
    typeof value.type !== 'string'
  ) {
    return false;
  }

  if (value.type === 'audio') {
    return (
      typeof value.source === 'string' &&
      audioSources.has(value.source as AudioSource)
    );
  }

  return value.type === 'pause' && typeof value.durationMs === 'number';
}

function isListeningProfile(value: unknown): value is ListeningProfile {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.steps) &&
    value.steps.every(isListeningProfileItem)
  );
}

export function readListeningProfile(): ListeningProfile {
  const storedProfile = readLocalStorageValue<unknown>(
    STORAGE_KEYS.listeningProfile,
    null,
  );

  return isListeningProfile(storedProfile)
    ? storedProfile
    : createDefaultListeningProfile();
}

export function writeListeningProfile(profile: ListeningProfile): void {
  writeLocalStorageValue(STORAGE_KEYS.listeningProfile, profile);
}
