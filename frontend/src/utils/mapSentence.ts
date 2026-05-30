import type { SourceSentence, Sentence } from '../types/sentence';

export function mapSourceSentence(
  sourceSentence: SourceSentence,
  index: number,
): Sentence {
  const id = sourceSentence.id;

  // maps the source sentence (sentence.json) to the Sentence type used in the app.
  return {
    id,
    frText: sourceSentence.fra,
    enText: sourceSentence.eng,
    enCharLength: sourceSentence.char_count,
    position: index + 1,
    frFemaleAudioUrl: `/api/audio/fr_f_complete/${id}_fr_f.wav`,
    frMaleAudioUrl: `/api/audio/fr_m_complete/${id}_fr_m.wav`,
    enFemaleAudioUrl: `/api/audio/en_f_complete/${id}_en_f.wav`,
    enMaleAudioUrl: `/api/audio/en_m_complete/${id}_en_m.wav`,
  };
}
