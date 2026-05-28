
import { DEFAULT_LISTENING_PROFILE } from "../constants/listeningProfileDefaults";
import { STORAGE_KEYS } from "../constants/storageKeys";
import type { ListeningProfile } from "../types/listeningProfile";

export function readListeningProfile(): ListeningProfile {
  const storedProfile = window.localStorage.getItem(STORAGE_KEYS.listeningProfile);

  if (!storedProfile) {
    return DEFAULT_LISTENING_PROFILE;
  }

  try {
    return JSON.parse(storedProfile) as ListeningProfile;
  } catch {
    return DEFAULT_LISTENING_PROFILE;
  }
}

export function writeListeningProfile(profile: ListeningProfile): void {
  window.localStorage.setItem(STORAGE_KEYS.listeningProfile, JSON.stringify(profile));
}
