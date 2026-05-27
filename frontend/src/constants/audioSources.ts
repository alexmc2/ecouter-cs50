import type { Sentence } from '../types/sentence';

export interface AudioSourceConfig {
  label: string;
  shortLabel: string;
  sentenceField: keyof Pick<
    Sentence,
    | 'frFemaleAudioUrl'
    | 'frMaleAudioUrl'
    | 'enFemaleAudioUrl'
    | 'enMaleAudioUrl'
  >;
}

export const AUDIO_SOURCE_CONFIG = {
  fr_female: {
    label: 'French female',
    shortLabel: 'FR F',
    sentenceField: 'frFemaleAudioUrl',
  },
  fr_male: {
    label: 'French male',
    shortLabel: 'FR M',
    sentenceField: 'frMaleAudioUrl',
  },
  en_female: {
    label: 'English female',
    shortLabel: 'EN F',
    sentenceField: 'enFemaleAudioUrl',
  },
  en_male: {
    label: 'English male',
    shortLabel: 'EN M',
    sentenceField: 'enMaleAudioUrl',
  },
};
