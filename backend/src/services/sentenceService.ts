import fs from 'node:fs';
import path from 'node:path';
import type { PaginatedResponse } from '../types/api';
import type {
  Sentence,
  SentenceRange,
} from '../types/sentence';
import { paginateItems } from '../utils/pagination';
import { buildSentenceRanges } from './sentenceRangeService';

// the sentence service is responsible for loading and providing access to the sentence library data.

let cachedSentences: Sentence[] | null = null;

function getDefaultSentenceLibraryPath(): string {
  const candidates = [
    path.resolve(process.cwd(), '../data/processed/sentences.app.json'),
    path.resolve(process.cwd(), 'data/processed/sentences.app.json'),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0];
}

function getSentenceLibraryPath(): string {
  return process.env.SENTENCE_LIBRARY_PATH ?? getDefaultSentenceLibraryPath();
}

function loadSentences(): Sentence[] {
  return JSON.parse(fs.readFileSync(getSentenceLibraryPath(), 'utf8')) as Sentence[];
}

export function getAllSentences(): Sentence[] {
  if (!cachedSentences) {
    cachedSentences = loadSentences();
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
