
import type { PaginatedResponse } from "../types/api";
import type { Sentence, SentenceRange } from "../types/sentence";
import { apiGet } from "./client";

export function fetchSentences(
  page = 1,
  limit = 100
): Promise<PaginatedResponse<Sentence>> {
  return apiGet<PaginatedResponse<Sentence>>(
    `/api/sentences?page=${page}&limit=${limit}`
  );
}

export function fetchSentenceById(id: number): Promise<Sentence> {
  return apiGet<Sentence>(`/api/sentences/${id}`);
}

export function fetchSentenceRanges(): Promise<SentenceRange[]> {
  return apiGet<SentenceRange[]>("/api/sentence-ranges");
}
