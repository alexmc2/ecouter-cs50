import type { SourceSentence, Sentence } from '../types/sentence';
import { buildAudioUrl } from './buildAudioPath';

export function mapSourceSentence(
  sourceSentence: SourceSentence,
  index: number,
): Sentence {
  return {
    id: sourceSentence.id,
    frText: sourceSentence.fra,
    enText: sourceSentence.eng,
    enCharLength: sourceSentence.char_count,
    position: index + 1,
    frFemaleAudioUrl: buildAudioUrl(sourceSentence.id, 'fr_female'),
    frMaleAudioUrl: buildAudioUrl(sourceSentence.id, 'fr_male'),
    enFemaleAudioUrl: buildAudioUrl(sourceSentence.id, 'en_female'),
    enMaleAudioUrl: buildAudioUrl(sourceSentence.id, 'en_male'),
  };
}
