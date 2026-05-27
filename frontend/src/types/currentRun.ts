import type { Sentence } from './sentence';

export interface CurrentRun {
  id: string;
  label: string;
  sentences: Sentence[];
  createdAt: string;
}

export interface StartRunRequest {
  label: string;
  sentences: Sentence[];
}
