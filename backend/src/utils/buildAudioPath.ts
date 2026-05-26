import type { AudioSource } from '../types/listeningProfile';

// This file contains the utility functions for building the file paths and URLs for audio files.
export type VoiceFolderName =
  | 'fr_f_complete'
  | 'fr_m_complete'
  | 'en_f_complete'
  | 'en_m_complete';

interface AudioSourceDefinition {
  folder: VoiceFolderName;
  suffix: string;
}

export const AUDIO_SOURCE_DEFINITIONS: Record<
  AudioSource,
  AudioSourceDefinition
> = {
  fr_female: {
    folder: 'fr_f_complete',
    suffix: 'fr_f',
  },
  fr_male: {
    folder: 'fr_m_complete',
    suffix: 'fr_m',
  },
  en_female: {
    folder: 'en_f_complete',
    suffix: 'en_f',
  },
  en_male: {
    folder: 'en_m_complete',
    suffix: 'en_m',
  },
};

export const ALLOWED_VOICE_FOLDERS = Object.values(
  AUDIO_SOURCE_DEFINITIONS,
).map((definition) => definition.folder);

export function buildAudioFilename(
  sentenceId: number,
  audioSource: AudioSource,
): string {
  const definition = AUDIO_SOURCE_DEFINITIONS[audioSource];

  // Returns {sentenceId}_{audioSourceSuffix}.wav - for example: 100001_fr_f.wav
  return `${sentenceId}_${definition.suffix}.wav`;
}

export function buildAudioUrl(
  sentenceId: number,
  audioSource: AudioSource,
): string {
  const definition = AUDIO_SOURCE_DEFINITIONS[audioSource];
  const filename = buildAudioFilename(sentenceId, audioSource);

  // Returns the full URL for the audio file - for example: /api/audio/fr_f_complete/100001_fr_f.wav
  return `/api/audio/${definition.folder}/${filename}`;
}
