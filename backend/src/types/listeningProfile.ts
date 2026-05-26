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
    }
  | {
      id: string;
      type: 'repeat';
      label: string;
    };

export interface ListeningProfile {
  id: string;
  name: string;
  steps: ListeningProfileItem[];
}
