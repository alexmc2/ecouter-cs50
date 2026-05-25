// AI assisted with building the audio path helper.
import type { AudioSource } from '../types/listeningProfile';

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
