// AI assisted with building the audio path helper.
import type { AudioSource } from '../types/listeningProfile';

export type VoiceFolderName =
  | 'french_female'
  | 'french_male'
  | 'english_female'
  | 'english_male';

export interface AudioSourceDefinition {
  folder: VoiceFolderName;
  suffix: string;
}

export const AUDIO_SOURCE_DEFINITIONS: Record<
  AudioSource,
  AudioSourceDefinition
> = {
  fr_female: {
    folder: 'french_female',
    suffix: 'fr_f',
  },
  fr_male: {
    folder: 'french_male',
    suffix: 'fr_m',
  },
  en_female: {
    folder: 'english_female',
    suffix: 'en_f',
  },
  en_male: {
    folder: 'english_male',
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

  return `${sentenceId}_${definition.suffix}.wav`;
}

export function buildAudioUrl(
  sentenceId: number,
  audioSource: AudioSource,
): string {
  const definition = AUDIO_SOURCE_DEFINITIONS[audioSource];
  const filename = buildAudioFilename(sentenceId, audioSource);

  return `/api/audio/${definition.folder}/${filename}`;
}
