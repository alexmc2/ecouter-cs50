import { useEffect, useState } from 'react';
import { fetchSentenceRanges } from '../api/sentenceApi';
import type { SentenceRange } from '../types/sentence';

export function useSentenceRanges() {
  const [data, setData] = useState<SentenceRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSentenceRanges() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchSentenceRanges();

        if (!cancelled) {
          setData(response);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Failed to load sentences.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSentenceRanges();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
