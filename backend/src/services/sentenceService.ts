import sentencesJson from '../data/sentences.json';
import type { PaginatedResponse } from '../types/api';
import type {
  SourceSentence,
  Sentence,
  SentenceRange,
} from '../types/sentence';
import { mapSourceSentence } from '../utils/mapSentence';
import { paginateItems } from '../utils/pagination';
import { buildSentenceRanges } from './sentenceRangeService';

const sourceSentences = sentencesJson as SourceSentence[];

let cachedSentences: Sentence[] | null = null;

export function getAllSentences(): Sentence[] {
  if (!cachedSentences) {
    cachedSentences = sourceSentences.map((sentence, index) =>
      mapSourceSentence(sentence, index),
    );
  }

  return cachedSentences;
}

export function getPaginatedSentences(
  page: number,
  limit: number,
): PaginatedResponse<Sentence> {
  return paginateItems(getAllSentences(), page, limit);
}

export function getSentenceById(sentenceId: number): Sentence | undefined {
  return getAllSentences().find((sentence) => sentence.id === sentenceId);
}

export function getSentenceRanges(): SentenceRange[] {
  return buildSentenceRanges(getAllSentences(), 100);
}

export function resetSentenceCacheForTests(): void {
  cachedSentences = null;
}
