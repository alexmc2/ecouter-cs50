export interface RawSentence {
  id: number;
  fra: string;
  eng: string;
  char_count: number;
}

export interface Sentence {
  id: number;
  frText: string;
  enText: string;
  enCharLength: number;
  position: number;
  frFemaleAudioUrl: string;
  frMaleAudioUrl: string;
  enFemaleAudioUrl: string;
  enMaleAudioUrl: string;
}

export interface SentenceRange {
  page: number;
  startPosition: number;
  endPosition: number;
  sentenceCount: number;
  minEnCharLength: number;
  maxEnCharLength: number;
}
