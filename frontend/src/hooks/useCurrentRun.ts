import { useState } from 'react';
import type { CurrentRun } from '../types/currentRun';

export function useCurrentRun() {
  const [currentRun, setCurrentRun] = useState<CurrentRun | null>(null);

  function startRun(run: CurrentRun): void {
    setCurrentRun(run);
  }

  function removeSentenceFromRun(sentenceId: number): void {
    setCurrentRun((run) => {
      if (!run) {
        return run;
      }

      const sentences = run.sentences.filter(
        (sentence) => sentence.id !== sentenceId,
      );

      if (sentences.length === run.sentences.length) {
        return run;
      }

      return {
        ...run,
        sentences,
      };
    });
  }

  return {
    currentRun,
    startRun,
    removeSentenceFromRun,
  };
}
