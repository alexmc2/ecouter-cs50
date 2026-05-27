
export type AudioSource = 'fr_female' | 'fr_male' | 'en_female' | 'en_male';

export type ListeningProfileItem =
  | {
      id: string;
      type: 'audio';
      source: AudioSource;
      label: string;
    }
  | {
      id: string;
      type: 'pause';
      durationMs: number;
      label: string;
    };

export interface ListeningProfile {
  id: string;
  name: string;
  steps: ListeningProfileItem[];
}

export type ListeningProfileItemTemplate =
  ListeningProfileItem extends infer Step
    ? Step extends { id: string }
      ? Omit<Step, 'id'>
      : never
    : never;

export interface ListeningProfilePreset {
  id: string;
  name: string;
  description: string;
  steps: ListeningProfileItemTemplate[];
}
