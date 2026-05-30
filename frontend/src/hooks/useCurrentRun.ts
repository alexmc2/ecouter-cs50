import { useEffect, useState } from 'react';
import { readCurrentRun, writeCurrentRun } from '../storage/currentRunStorage';
import type { CurrentRun } from '../types/currentRun';

// this hook manages the state of the sentences that the user has selected (current run). It persists the current run to local storage.

export function useCurrentRun() {
  const [currentRun, setCurrentRun] = useState<CurrentRun | null>(() =>
    readCurrentRun(),
  );

  useEffect(() => {
    writeCurrentRun(currentRun);
  }, [currentRun]);

  function startRun(run: CurrentRun): void {
    setCurrentRun(run);
    console.log('Started run', run);
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
