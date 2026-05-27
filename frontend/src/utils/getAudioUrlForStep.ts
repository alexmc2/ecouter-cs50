
import { AUDIO_SOURCE_CONFIG } from '../constants/audioSources';
import type { ListeningProfileItem } from '../types/listeningProfile';
import type { Sentence } from '../types/sentence';

export function getAudioUrlForStep(
  sentence: Sentence,
  step: ListeningProfileItem,
): string | null {
  if (step.type !== 'audio') {
    return null;
  }

  return sentence[AUDIO_SOURCE_CONFIG[step.source].sentenceField];
}
