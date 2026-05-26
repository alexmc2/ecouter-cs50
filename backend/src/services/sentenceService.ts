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

// loads the source sentences from the master json file (sentences.json) and maps the data for the controller. 

const sourceSentences = sentencesJson as SourceSentence[];

let cachedSentences: Sentence[] | null = null;

// Maps the source sentences to the Sentence type.
export function getAllSentences(): Sentence[] {
  // Caches the mapped sentences so that they aren't reloaded on every request.
  if (!cachedSentences) {
    cachedSentences = sourceSentences.map((sentence, index) =>
      mapSourceSentence(sentence, index),
    );
  }

  return cachedSentences;
}
// Retrieves a paginated list of sentences.
export function getPaginatedSentences(
  page: number,
  limit: number,
): PaginatedResponse<Sentence> {
  return paginateItems(getAllSentences(), page, limit);
}

// Retrieves a single sentence by its ID.
export function getSentenceById(sentenceId: number): Sentence | undefined {
  return getAllSentences().find((sentence) => sentence.id === sentenceId);
}

// retrieves sentence ranges and returns them as JSON.
export function getSentenceRanges(): SentenceRange[] {
  return buildSentenceRanges(getAllSentences(), 100);
}
