import { useEffect, useState } from 'react';
import { fetchSentences } from '../api/sentenceApi';
import type { PaginatedResponse } from '../types/api';
import type { Sentence } from '../types/sentence';

export function useSentences(
  page = 1,
  limit = 100,
  enabled = false,
  startPosition?: number,
) {
  const [data, setData] = useState<PaginatedResponse<Sentence> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    async function loadSentences() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchSentences(page, limit, startPosition);

        if (!cancelled) {
          setData(response);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Failed to load.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSentences();

    return () => {
      cancelled = true;
    };
  }, [enabled, limit, page, startPosition]);

  return { data, loading, error };
}
