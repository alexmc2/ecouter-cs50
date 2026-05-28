
import type { PaginatedResponse } from "../types/api";
import type { Sentence, SentenceRange } from "../types/sentence";
import { apiGet } from "./client";

export function fetchSentences(
  page = 1,
  limit = 100,
  startPosition?: number,
): Promise<PaginatedResponse<Sentence>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (startPosition !== undefined) {
    params.set('startPosition', String(startPosition));
  }

  return apiGet<PaginatedResponse<Sentence>>(
    `/api/sentences?${params.toString()}`,
  );
}

export function fetchSentenceById(id: number): Promise<Sentence> {
  return apiGet<Sentence>(`/api/sentences/${id}`);
}

export function fetchSentenceRanges(): Promise<SentenceRange[]> {
  return apiGet<SentenceRange[]>("/api/sentence-ranges");
}
